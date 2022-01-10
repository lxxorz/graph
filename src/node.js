export function Node (id, next = []) {
    this.id = id
    this.next = next
}

//将点集合转换为
// {nodes: [...], links:[...]}
Node.transiform = (node_set)=>{
    let nodes = new Set()
    let edges = []
    for(let i = 0; i < node_set.length; ++i) {
        if(nodes.has(node_set)) continue;
        nodes.add(node_set[i])
        for(let node = node_set[i], next = node.next, j = 0; j < next.length; ++j){
            edges.push({
                source: node,
                target: next[j]
            })
        }
    }
    return {
        nodes: [...nodes],
        links: edges
    }
}

export function Circle(id, r, color = null, next = [],) {
    Node.call(this,id, next)
    this.r = r;
    this.color = color;
}

Circle.prototype = Object.create(Node.prototype);
