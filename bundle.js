(function () {
    'use strict';

    function Node (id, next = []) {
        this.id = id;
        this.next = next;
    }

    //将点集合转换为
    // {nodes: [...], links:[...]}
    Node.transiform = (node_set)=>{
        let nodes = new Set();
        let edges = [];
        for(let i = 0; i < node_set.length; ++i) {
            if(nodes.has(node_set)) continue;
            nodes.add(node_set[i]);
            for(let node = node_set[i], next = node.next, j = 0; j < next.length; ++j){
                edges.push({
                    source: node,
                    target: next[j]
                });
            }
        }
        return {
            nodes: [...nodes],
            links: edges
        }
    };

    function Circle(id, r, color = null, next = [],) {
        Node.call(this,id, next);
        this.r = r;
        this.color = color;
    }

    Circle.prototype = Object.create(Node.prototype);

    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 960 - margin.left - margin.right,
        height = 640 - margin.top - margin.bottom;

    var svg = d3.select('body')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    let g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //添加按钮
    let menu = d3.select('body')
        .append('div')
        .attr('class', 'menu');
    d3.select('.menu')
        .append('button')
        .text('并查集')
        .attr('data-action', 'union');
    d3.select('.menu')
        .append('button')
        .text('深度优先搜索')
        .attr('data-action', 'dfs');
    d3.select('.menu')
        .append('button')
        .text('广度优先搜索')
        .attr('data-action', 'bfs');
    d3.select('.menu')
        .append('button')
        .text('重置')
        .attr('data-action', 'reset');


    let x, y; //起始结点、结束结点


    //获取结点
    function get_node(id) {
        return d3.select('#_' + id)
            .datum()
    }

    let update_x = function (e) {
        x = get_node(e.srcElement.value);
    };

    let update_y = function (e) {
        y = get_node(e.srcElement.value);
    };

    //添加输入
    const input = d3.select('body')
        .append('div')
        .attr('class', 'input-group');
    input.append('label')
        .attr('for', '#node-x')
        .text('结点编号 x ');
    input.append('input')
        .attr('type', 'number')
        .attr('id', 'node-x');
    input.append('br');
    input.append('label')
        .attr('for', '#node-y')
        .text('结点编号 y ');
    input.append('input')
        .attr('type', 'number')
        .attr('id', 'node-y');
    input.append('br');
    input.append('div')
        .attr('class', 'result');

    //添加事件侦听器
    document.getElementById('node-x')
        .addEventListener('input', update_x);
    document.getElementById('node-y')
        .addEventListener('input', update_y);

    //svg 箭头
    g.append('defs')
        .append('marker')
        .attr('id', 'triangle')
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .attr('refX', 30)
        .attr('refY', 5)
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 Z');


    class Menu {
        constructor(elem) {
            this._elem = elem;
            elem.onclick = this.onClick.bind(this);
        }
        dfs() {
            //已访问过的元素
            let visited = new Set();
            async function run(datum) {
                if (datum === undefined || y === undefined) return;
                visited.add(datum);
                let node = d3.select('#_' + datum.id);
                //渲染
                await node.transition()
                    .duration(1000)
                    .style('fill', 'red')
                    .end();

                //如果目标id和当前结点id相同，dfs找到目标返回
                if (datum.id == y.id) {
                    await node.transition()
                        .duration(1000)
                        .style('fill', 'green')
                        .end();
                    return;
                }

                //没有到终点则继续在相邻结点中寻找
                for (let next of datum.next) {
                    if (!visited.has(next)) {
                        await run(next);
                    }
                }
                visited.delete(datum);
            }
            run(x);
        }
        bfs() {
            let visited = new Set();
            async function run(datum) {
                visited.clear();
                if (datum === undefined || y === undefined) return;
                //栈
                let stack = new Array();
                stack.push(datum);
                visited.add(datum);
                while (stack.length) {
                    //取出栈顶元素
                    let top = stack.pop();
                    console.log(top.id);
                    //渲染
                    let node = d3.select('#_' + top.id);
                    await node.transition()
                        .duration(1000)
                        .style('fill', 'red')
                        .end();
                    //如果是终点，结束寻找
                    if (datum.id == y.id) break;
                    //加入相邻结点
                    for (let next of top.next) {
                        if (!visited.has(next)) {
                            stack.push(next);
                        }
                        visited.add(next);
                    }
                }
            }
            run(x);
        }
        union() {
            //并查集
            let Union = {
                f: new Map(data.nodes.map(d => [d, d])),
                find(node) {
                    let rep = this.f.get(node);
                    return rep === node ? rep : this.find(rep);
                },
                is_connected(x, y) {
                    let nx = this.find(x), ny = this.find(y);
                    if (nx === ny && nx !== undefined) return true;
                    return false;
                },
                merge(x, y) {
                    let nx = this.find(x), ny = this.find(y);
                    if (nx !== ny) {
                        this.f.set(nx, ny);
                    }
                }
            };

            //合并所有结点
            function merge_all(nodes) {
                for (let node of nodes) {
                    for (let i = 0, next_nodes = node.next; i < next_nodes.length; ++i) {
                        let next = next_nodes[i];
                        Union.merge(node, next);
                    }
                }
            }



            merge_all(data.nodes);

            function run() {
                if (x === undefined || y === undefined) return;
                let res = Union.is_connected(x, y);
                let map = ['不在', '在'];
                let str = `${x.id}, ${y.id} ${map[+res]}一个集合`;
                str += `${Union.find(x).id},${Union.find(y).id}`;
                console.log(str);
                d3.select('.result')
                    .text(str);
            }
            run();
        }
        //重置所有结点背景是黄色
        reset() {
            d3.selectAll('circle')
                .style('fill', 'yellow');
        }

        onClick(e) {
            let action = e.target.dataset.action;
            if (action) {
                this[action]();
            }
        }
    }
    new Menu(menu.node());
    function mock_data() {
        function gen_node(n, r = 20) {
            let nodes = [];
            for (let i = 0; i < n; ++i) {
                let circle = new Circle(i, r, 'yellow');
                circle.next = [];
                nodes.push(circle);
            }
            return nodes;
        }

        let n = 11;
        let nodes = gen_node(n);
        let threshold = 0.3;
        for (let i = 0; i < nodes.length; ++i) {
            for (let j = 0; j < nodes.length; ++j) {
                let condition = Math.random() < threshold;
                if (j !== i && condition) {
                    nodes[i].next.push(nodes[j]);
                    break;
                }
            }
        }
        return nodes;
    }

    let dataset = mock_data();
    let data = Node.transiform(dataset);

    let links_group = g.append('g')
        .attr('class', 'lines');

    let links = links_group.selectAll('line')
        .data(data.links);

    let nodes_group = g.append('g')
        .attr('class', 'circle');

    let nodes = nodes_group
        .selectAll('circle')
        .data(data.nodes);

    let texts_group = g.append('g')
        .classed('texts', true);

    let texts = texts_group
        .selectAll('text')
        .data(data.nodes);


    function append() {
        nodes.data(data.nodes)
            .enter()
            .append('circle')
            .attr('r', d => d.r)
            .attr('id', d => '_' + d.id)
            .style('fill', d => d.color);
        texts.data(data.nodes)
            .enter()
            .append('text');
        links.data(data.links)
            .enter()
            .append('line');
        d3.selectAll('circle')
            .call(d3.drag()
                .on('start', started)
                .on('drag', dragged)
                .on('end', ended)
            );
    }

    append();

    const simulation = d3.forceSimulation()
        .nodes(data.nodes)
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('charge', d3.forceManyBody()
            .strength(-200))
        .force('link', d3.forceLink(data.links)
            .distance(60))
        .on('tick', ticked);

    //受力迭代函数
    function ticked() {

        nodes = nodes_group.selectAll('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        links = links_group.selectAll('line')
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)
            .attr('marker-end', ('url(#triangle)'));

        texts = texts_group.selectAll('text')
            .attr('x', d => d.x - 5)
            .attr('y', d => d.y + 5)
            .text(d => d.id);
    }



    // 拖拽结点
    function started(e) {
        if (!e.active) simulation.alphaTarget(0.3)
            .restart();
    }

    function dragged(e, d) {
        d.fx = e.x;
        d.fy = e.y;
    }

    function ended(e, d) {
        const circle = d3.select(this)
            .classed('dragging', true);
        if (!e.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        circle.classed('dragging', false);

        //计算据该点距离
        let get_distance = (a, b) => {
            const delta_x = a.x - b.x;
            const delta_y = a.y - b.y;
            let distance = Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2));
            return distance;
        };

        let nodes = data.nodes.filter(node => node !== d);
        let adjacent = nodes.reduce((adj, node) => {
            let dis_adj = get_distance(adj, d);
            let dis_node = get_distance(node, d);
            return dis_adj > dis_node ? node : adj;
        });

        let distance = get_distance(adjacent, d);

        if (adjacent && distance < 40) {
            d.next.push(adjacent);
            data.links.push({ source: d, target: adjacent });
            links.data(data.links)
                .enter()
                .append('line');
            simulation.force('link', d3.forceLink(data.links)
                .distance(60));
        }
    }

    svg.node()
        .addEventListener('click', (e) => {
            console.log(e.target, svg.node());
            if (e.target !== svg.node()) return;

            //添加一个结点
            let length = data.nodes.length;
            let circle = new Circle(length, 20, 'yellow');
            circle.x = +e.x;
            circle.y = +e.y;
            data.nodes.push(circle);
            simulation.nodes(data.nodes);

            //添加结点
            append();

            simulation.alpha(0.1)
                .restart();
            d3.selectAll('circle')
                .call(d3.drag()
                    .on('start', started)
                    .on('drag', dragged)
                    .on('end', ended)
                );
        });

})();
