import copy
import json


def stagecoach(graph: dict, phases: dict):
    validate(graph, phases)
    reversed_graph = dict(reversed(list(graph.items())))
    solved_graph = copy.deepcopy(walk_graph(
        reversed_graph, graph, phases))
    solution_best_path = find_best_paths_limited(
        solved_graph)
    nodes_json = json.dumps(solved_graph)
    path_json = json.dumps(solution_best_path)
    return nodes_json, path_json


def validate(graph: dict, phases: dict):
    graph_copy = copy.deepcopy(graph)
    if len(list(graph_copy.keys())) == 0 or len(list(phases.keys())) == 0:
        raise Exception("empty")
    last_phase = phases[list(graph_copy.keys())[-1]]
    for key, value in graph_copy.items():
        f_phase = phases[key]
        for k, _ in value.items():
            k_phase = phases.get(k, last_phase + 1)
            if f_phase + 1 != k_phase:
                raise Exception("Wrong edge connection")


def walk_graph(reversed_graph: dict, original_graph: dict, phases: dict):
    graph_copy = copy.deepcopy(original_graph)
    for node, _ in reversed_graph.items():
        if len(graph_copy.get(node).keys()) == 1:
            sum_data = {}
            key_node = list(reversed_graph.get(node).keys())[0]
            key_graph = reversed_graph.get(key_node, 0)
            if key_graph == 0:
                reversed_graph[node][f"f*(s){node}"] = reversed_graph.get(
                    node).get(key_node) + key_graph
                sum_data[key_node] = reversed_graph.get(
                    node).get(key_node) + key_graph
            else:
                reversed_graph[node][f"f*(s){node}"] = reversed_graph.get(
                    node).get(key_node) + key_graph.get(f"f*(s){key_node}")
                sum_data[key_node] = reversed_graph.get(node).get(
                    key_node) + key_graph.get(f"f*(s){key_node}")
            reversed_graph[node]["f(s,x)"] = sum_data

        if len(graph_copy.get(node).keys()) > 1:
            sum_data = {}
            keys = list(reversed_graph.get(node).keys())
            for key in keys:
                in_key = reversed_graph.get(node).get(key)
                graph_key = reversed_graph.get(key).get(f"f*(s){key}")
                sum_data[key] = in_key+graph_key
            reversed_graph[node][f"f*(s){node}"] = sum_data.get(
                min(sum_data, key=lambda k: sum_data[k]))
            reversed_graph[node]["f(s,x)"] = sum_data

    new_dictionary = {}
    for key, value in reversed_graph.items():
        new_value = {}
        for subkey, subvalue in value.items():
            new_subkey = subkey.replace(f"f*(s){key}", "f*(s)")
            new_value[new_subkey] = subvalue
        new_dictionary[key] = new_value
    reversed_graph = new_dictionary

    find_node_to_go(reversed_graph)
    for key, phase in phases.items():
        reversed_graph.get(key)["phase"] = phase
    return reversed_graph


def find_node_to_go(graph: dict):
    for node, _ in graph.items():
        nodes_found = []
        best_weight = graph.get(node).get("f*(s)")
        nodes_dict = graph.get(node).get("f(s,x)")
        for key, value in nodes_dict.items():
            if value == best_weight:
                nodes_found.append(key)
        graph[node]["x*"] = nodes_found


def find_best_paths_limited(graph: dict):
    graph_c = dict(reversed(list(copy.deepcopy(graph).items())))
    first_node = list(graph_c.keys())[0]
    start = graph_c[first_node]["x*"]
    last_node = graph_c[list(graph_c.keys())[-1]]["x*"][0]
    best_paths = []

    for step in start:
        path = []
        path.append(first_node)
        walk = step
        while walk != last_node:
            path.append(walk)
            walk = graph_c[walk]["x*"][0]
        path.append(last_node)
        best_paths.append(path)

    return best_paths
