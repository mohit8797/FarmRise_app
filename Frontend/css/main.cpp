#include <iostream>
#include <vector>
#include <queue>
#include <climits>
#include <stack>
using namespace std;

typedef pair<int, int> pii; // {weight, node}

vector<int> dijkstra(int n, vector<vector<pii>> &adj, int source, int destination) {
    vector<int> dist(n, INT_MAX);
    vector<int> parent(n, -1);
    priority_queue<pii, vector<pii>, greater<pii>> pq;

    dist[source] = 0;
    pq.push({0, source});

    while (!pq.empty()) {
        int u = pq.top().second;
        int currentDist = pq.top().first;
        pq.pop();

        if (u == destination) break;

        for (auto &[v, weight] : adj[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                parent[v] = u;
                pq.push({dist[v], v});
            }
        }
    }

    // Reconstruct path
    vector<int> path;
    for (int at = destination; at != -1; at = parent[at])
        path.push_back(at);

    reverse(path.begin(), path.end());

    if (path[0] != source)
        path.clear(); // No path exists

    return path;
}

int main() {
    int n, m;
    cout << "Enter number of intersections (nodes) and roads (edges): ";
    cin >> n >> m;

    vector<vector<pii>> adj(n); // adjacency list

    cout << "Enter roads in the format (u v w):\n";
    for (int i = 0; i < m; ++i) {
        int u, v, w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w}); // assuming bidirectional roads
    }

    int source, destination;
    cout << "Enter source (ambulance) and destination (patient): ";
    cin >> source >> destination;

    vector<int> shortestPath = dijkstra(n, adj, source, destination);

    if (shortestPath.empty()) {
        cout << "No path found from source to destination.\n";
    } else {
        cout << "Shortest path: ";
        for (int node : shortestPath)
            cout << node << " ";
        cout << "\nTotal travel time: ";

        // Calculate total travel time
        int totalTime = 0;
        for (size_t i = 1; i < shortestPath.size(); ++i) {
            int u = shortestPath[i - 1];
            int v = shortestPath[i];
            for (auto &[nei, wt] : adj[u]) {
                if (nei == v) {
                    totalTime += wt;
                    break;
                }
            }
        }
        cout << totalTime << endl;
    }

    return 0;
}