import json
import sys


def parse_stream(file_path):
    system_instructions = []
    tools = []
    api_specs = {}
    reconstructed_messages = []
    ai_message_buffer = ""

    with open(file_path, "r") as f:
        for line in f:
            if not line.startswith("data: "):
                continue

            data_str = line[len("data: ") :].strip()
            if not data_str:
                continue

            try:
                data = json.loads(data_str)
            except json.JSONDecodeError:
                continue

            # Case 1: Initial config or messages
            if isinstance(data, dict):
                # Search for potential system instructions in all string values
                def find_instructions(obj, path=""):
                    if isinstance(obj, str) and (
                        "You are" in obj
                        or "instruction" in obj.lower()
                        or "act as" in obj.lower()
                        or "# Skills" in obj
                    ):
                        return [(path, obj)]
                    res = []
                    if isinstance(obj, dict):
                        for k, v in obj.items():
                            res.extend(
                                find_instructions(v, path + "." + k if path else k)
                            )
                    if isinstance(obj, list):
                        for i, item in enumerate(obj):
                            res.extend(find_instructions(item, path + f"[{i}]"))
                    return res

                potentials = find_instructions(data)
                for p_path, p_content in potentials:
                    if p_content not in system_instructions:
                        system_instructions.append(p_content)

                if "messages" in data:
                    for msg in data["messages"]:
                        if msg not in reconstructed_messages:
                            reconstructed_messages.append(msg)

                if "init" in data:
                    if "selected_tools" in data["init"]:
                        tools = data["init"]["selected_tools"]
                    if "api_specs" in data["init"]:
                        api_specs.update(data["init"]["api_specs"])

                if "config" in data and "api_spec_json" in data["config"].get(
                    "configurable", {}
                ):
                    api_specs.update(data["config"]["configurable"]["api_spec_json"])

            # Case 2: Message chunks
            elif isinstance(data, list) and len(data) > 0:
                chunk = data[0]
                if isinstance(chunk, dict) and chunk.get("type") == "AIMessageChunk":
                    content = chunk.get("content", [])
                    for part in content:
                        if part.get("type") == "text":
                            ai_message_buffer += part.get("text", "")

    return {
        "system_instructions": system_instructions,
        "tools": tools,
        "api_specs": api_specs,
        "ai_response": ai_message_buffer,
        "messages": reconstructed_messages,
    }


if __name__ == "__main__":
    import os

    script_dir = os.path.dirname(os.path.abspath(__file__))
    result = parse_stream(os.path.join(script_dir, "stream.txt"))

    with open(os.path.join(script_dir, "api_spec.json"), "w") as f:
        json.dump(result["api_specs"], f, indent=2)

    print("### SYSTEM INSTRUCTIONS (Found in trace) ###")
    for instr in result["system_instructions"]:
        print("-" * 20)
        print(instr[:1000] + "..." if len(instr) > 1000 else instr)

    print("\n### TOOLS ###")
    print(result["tools"])

    print("\n### MESSAGES ###")
    for msg in result["messages"]:
        print(f"[{msg.get('type')}] {msg.get('content')}")

    print("\n### AI RESPONSE ###")
    print(result["ai_response"])

    print("\nFull API Spec saved to /Users/m1a1/Developer/reversing/api_spec.json")
