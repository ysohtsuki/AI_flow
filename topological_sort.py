from collections import deque

def topological_sort(edges):
    """トポロジカルソート
    
    有向グラフの順序を守るようにソートする
    閉路があるか判定も出来る
    計算量: O(E+V)
    
    Args:
        edges (list of tuples): edge[i] = (a, b) という形式で、aからbに辺が伸びている
    
    Returns:
        list or -1: 閉路が存在しないとき
                        ソート済みのリスト
                    閉路が存在する時
                        -1
    """
    # ノードとそのインデックスを決定
    nodes = set()
    for u, v in edges:
        if u is not None:
            nodes.add(str(u))
        if v is not None:
            nodes.add(str(v))
    
    nodes = list(nodes)
    node_index = {node: idx for idx, node in enumerate(nodes)}

    # 隣接リストと入力辺リストを作成
    node = [[] for _ in range(len(nodes))]
    input_edge = [0] * len(nodes)

    for u, v in edges:
        if u is not None and v is not None:
            u = str(u)
            v = str(v)
            node[node_index[u]].append(node_index[v])
            input_edge[node_index[v]] += 1

    # トポロジカルソート
    N = len(input_edge)
    ans = [i for i in range(N) if input_edge[i] == 0]
    que = deque(ans)
    while que:
        q = que.popleft()
        for e in node[q]:
            input_edge[e] -= 1
            if input_edge[e] == 0:
                que.append(e)
                ans.append(e)
    
    if len(ans) == N:
        sorted_nodes = [nodes[i] for i in ans]
        return sorted_nodes
    return -1
