#include "list.h"
#include <stdio.h>
#include <stdlib.h>

int main() {
  List *list = list_new();

  ListItem *list_item = malloc(sizeof(ListItem));
  int *value = malloc(sizeof(int));
  *value = 10;
  list_item->value = value;
  list_add(list, list_item);

  ListItem *list_item2 = malloc(sizeof(ListItem));
  int *value2 = malloc(sizeof(int));
  *value2 = 11;
  list_item2->value = value2;
  list_add(list, list_item2);

  ListItem *list_item3 = malloc(sizeof(ListItem));
  int *value3 = malloc(sizeof(int));
  *value3 = 12;
  list_item2->value = value3;
  list_add(list, list_item2);

  printf("%d", *((int *)list->head->value));
  printf("%d", *((int *)list->tail->value));
  printf("%ld", list->length);
}
