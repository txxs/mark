https://www.programcreek.com/2013/03/leetcode-lru-cache-java/

### 整体思路

1、双向节点+value+key，先入先出队列，数据添加到尾部

2、两个公共方法：删除原位置数据和增加头部数据

3、获取，删除原位置，增加头部

4、增加，如果原来有异动位置，原来没有新建，如果空间不够还要考虑到过期策略

5、核心还是一个map

6、头部移除，尾部增加

### 节点内容

```
class Node{
    int key;
    int value;
    Node prev;
    Node next;
 
    public Node(int key, int value){
        this.key=key;
        this.value=value;
    }
}
```

### 具体算法
```
class LRUCache {
    Node head;
    Node tail;
    HashMap<Integer, Node> map = null;
    int cap = 0;
 
    public LRUCache(int capacity) {
        this.cap = capacity;
        this.map = new HashMap<>();
    }
 
    public int get(int key) {
        if(map.get(key)==null){
            return -1;
        }
 
        //move to tail
        Node t = map.get(key);
 
        removeNode(t);
        offerNode(t);
 
        return t.value;
    }
 
    public void put(int key, int value) {
        if(map.containsKey(key)){
            Node t = map.get(key);
            t.value = value;
 
            //move to tail
            removeNode(t);
            offerNode(t);
        }else{
            if(map.size()>=cap){
                //delete head
                map.remove(head.key);
                removeNode(head);
            }
 
            //add to tail
            Node node = new Node(key, value);
            offerNode(node);
            map.put(key, node);
        }
    }
 
    private void removeNode(Node n){
        if(n.prev!=null){
            n.prev.next = n.next;
        }else{
            head = n.next;
        }
 
        if(n.next!=null){
            n.next.prev = n.prev;
        }else{
            tail = n.prev;
        }
    }
 
    private void offerNode(Node n){
        if(tail!=null){
            tail.next = n;
        }
 
        n.prev = tail;
        n.next = null;
        tail = n;
 
        if(head == null){
            head = tail;   
        }
    }
}

```
