#ifndef _LIST_H
#define _LIST_H

typedef struct {
  void *next;
  void *value;
} ListItem;

typedef struct {
  ListItem *head;
  ListItem *tail;
  long length;
} List;

List *list_new();
void list_add(List *list, ListItem *list_item);

#endif
