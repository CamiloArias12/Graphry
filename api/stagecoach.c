#include "./list/list.h"

#include <stdio.h>
#include <stdlib.h>

typedef struct {
  List *edges;
  List *weights;
  long label;
  long accumulate;
  List *better_edges;
} GraphNode;

typedef struct {
  GraphNode *head;
  GraphNode *tail;
} Graph;

void graph_new() {}

GraphNode *graph_node_new(long label) {
  GraphNode *graph_node = malloc(sizeof(GraphNode));

  if (graph_node == NULL) {
    printf("There isn't much memory to allocate a new Graph.");
    exit(1);
  }

  graph_node->edges = list_new();
  graph_node->weights = list_new();
  graph_node->better_edges = list_new();
  graph_node->label = label;
  graph_node->accumulate = 0;

  return graph_node;
}

void graph_add_direct_edge(GraphNode *from, GraphNode *to, long weight) {
  ListItem *edge_item = malloc(sizeof(ListItem));
  edge_item->value = to;

  ListItem *edge_weight = malloc(sizeof(ListItem));
  long *weight_value = malloc(sizeof(long));
  *weight_value = weight;
  edge_weight->value = weight_value;

  list_add(from->edges, edge_item);
  list_add(from->weights, edge_weight);
}

void stagecoach(GraphNode *root, GraphNode *tail) {
  List *edges = root->edges;
  ListItem *edge = edges->head;

  List *weights = root->weights;
  ListItem *weight = weights->head;

  if (edges->length != weights->length) {
    printf("The weights and edges must be the same lenght.");
    exit(1);
  }

  while (edge != NULL) {
    GraphNode *graph_node = (GraphNode *)edge->value;
    long *weight_value = (long *)weight->value;

    printf("\n%ld %ld %ld\n", tail->label, graph_node->label, root->label);
    printf("Root(%ld) -> Edge(%ld) \t", root->label, graph_node->label);
    if(root->label == tail->label){
      printf("\nthe same\n");
    }
    graph_node->accumulate += root->accumulate + *weight_value;
    printf("accumulate: %ld\t", graph_node->accumulate);
    printf("weight: %ld\n", *weight_value);

    edge = edge->next;
    weight = weight->next;

    stagecoach(graph_node, tail);
  }
}

int main() {

  GraphNode *graph_node_10 = graph_node_new(10);
  GraphNode *graph_node_9 = graph_node_new(9);
  GraphNode *graph_node_8 = graph_node_new(8);
  GraphNode *graph_node_7 = graph_node_new(7);

  Graph *graph = malloc(sizeof(Graph));
  graph->head = graph_node_10;
  graph->tail = graph_node_7;

  // First stage
  graph_add_direct_edge(graph_node_10, graph_node_8, 3);
  graph_add_direct_edge(graph_node_10, graph_node_9, 4);

  // Second stage

  /*
  graph_add_direct_edge(graph_node_8, graph_node_5, 1);
  graph_add_direct_edge(graph_node_8, graph_node_6, 6);
  graph_add_direct_edge(graph_node_8, graph_node_7, 3);

  graph_add_direct_edge(graph_node_9, graph_node_5, 4);
  graph_add_direct_edge(graph_node_9, graph_node_6, 3);
  graph_add_direct_edge(graph_node_9, graph_node_7, 3);
  */

  graph_add_direct_edge(graph_node_8, graph_node_7, 5);
  graph_add_direct_edge(graph_node_9, graph_node_7, 4);

  stagecoach(graph->head, graph->tail);
}
