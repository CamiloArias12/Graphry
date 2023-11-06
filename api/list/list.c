#include "list.h"
#include <stdio.h>
#include <stdlib.h>

List *list_new() {
  List *list = (List *)malloc(sizeof(List));
  list->length = 0;
  list->head = NULL;
  list->tail = NULL;

  if (list == NULL) {
    printf("There isn't much memory to allocate a new list.");
    exit(1);
  }
  return list;
}

void list_add(List *list, ListItem *list_item) {
  if (list->head == NULL) {
    list->head = list_item;
    list->tail = list_item;
  } else {
    ListItem *last_item = list->tail;
    last_item->next = list_item;
    list->tail = list_item;
  }

  list->length++;
}
