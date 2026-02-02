import asyncio
import json
import os
import time
import uuid
from typing import Any


# Directory for IPC files - unique per code_execution invocation
pfc_dir = "/tmp/srvtoolu_01RgXnAE52bYENr141wxaLvz"


class PFCToolCallRegistry:
    """Singleton registry managing all pending async tool calls.

    Monitors response files and signals when they're ready.
    """

    _instance: "PFCToolCallRegistry | None" = None

    def __init__(self):
        self._pending_calls: dict[str, asyncio.Future[None]] = {}
        self._monitor_task: asyncio.Task[None] | None = None

    @classmethod
    def get_instance(cls) -> "PFCToolCallRegistry":
        """Get or create singleton instance."""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    async def wait_for_response(self, custom_tool_use_id: str) -> None:
        """Wait for a response file to be ready.

        Args:
            custom_tool_use_id: Unique ID for this custom tool call
        """
        future: asyncio.Future[None] = asyncio.Future()
        self._pending_calls[custom_tool_use_id] = future

        # Start monitor on first registration
        if self._monitor_task is None:
            self._monitor_task = asyncio.create_task(self._monitor_loop())

        # Wait for signal (no timeout here, monitor handles overall timeout)
        await future

    async def _monitor_loop(self):
        """Single monitoring loop with inactivity timeout.

        Checks all response files in one directory scan, signals futures when ready.
        Times out after 4.5 minutes of no activity (container lives for 5 min).
        """
        last_activity = time.time()
        timeout_seconds = 270  # 4.5 minutes

        while True:
            if self._pending_calls:
                # Get all files in directory (single syscall)
                files = os.listdir(pfc_dir)

                # Filter for response files
                response_files = {f for f in files if f.endswith(".response")}

                to_remove: list[str] = []
                # Check which pending calls have responses ready
                for custom_tool_use_id, future in self._pending_calls.items():
                    response_filename = f"{custom_tool_use_id}.response"
                    if response_filename in response_files:
                        if not future.done():
                            future.set_result(None)
                        to_remove.append(custom_tool_use_id)
                        last_activity = time.time()

                for custom_tool_use_id in to_remove:
                    del self._pending_calls[custom_tool_use_id]

                # Check for inactivity timeout
                if time.time() - last_activity > timeout_seconds:
                    # Timeout - cancel all pending futures
                    for future in self._pending_calls.values():
                        if not future.done():
                            future.cancel()
                    return

            await asyncio.sleep(0.1)  # Poll every 100ms


async def _call_client_tool(tool_name: str, **kwargs: Any) -> Any:
    """Call a client tool and wait for response.

    Args:
        tool_name: Original tool name
        **kwargs: Function arguments (should contain 'params' key)

    Returns:
        Tool result (type varies based on tool)
    """
    if not isinstance(tool_name, str):
        raise TypeError(
            f"tool_name must be a string, got {type(tool_name).__name__}: {tool_name!r}"
        )

    # Generate unique ID for this tool call
    custom_tool_use_id = uuid.uuid4().hex

    params: dict[str, Any] = kwargs.get("params", {})

    request: dict[str, Any] = {
        "tool": tool_name,
        "parameters": params,
        "tool_use_id": custom_tool_use_id,
    }

    # Write request file
    request_file = f"{pfc_dir}/{custom_tool_use_id}.request"
    with open(request_file, "w") as f:
        json.dump(request, f)

    # Log to stdout for orchestrator to intercept
    _original_stdout.write(f"[TOOL_CALL] {json.dumps(request)}\n")
    _original_stdout.flush()

    # Wait for response file
    registry = PFCToolCallRegistry.get_instance()
    try:
        await registry.wait_for_response(custom_tool_use_id)
    except asyncio.CancelledError:
        raise TimeoutError(f"Calling tool ['{tool_name}'] timed out.") from None

    # Read response
    response_file = f"{pfc_dir}/{custom_tool_use_id}.response"
    with open(response_file) as f:
        response = json.load(f)

    _original_stdout.write(f"[TOOL_RESULT] {json.dumps(response)}\n")
    _original_stdout.flush()

    return response["content"]


# Thin wrappers for each tool
async def get_cell_ranges(params: dict) -> str:
    return await _call_client_tool("get_cell_ranges", **locals())


async def get_range_as_csv(params: dict) -> str:
    return await _call_client_tool("get_range_as_csv", **locals())


async def set_cell_range(params: dict) -> str:
    return await _call_client_tool("set_cell_range", **locals())
