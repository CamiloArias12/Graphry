
import React from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

const NodeContextMenu = ({ onEdit, onDelete }:{onEdit:any,onDelete:any}) => {
  return (
    <ContextMenu id="node-context-menu">
      <MenuItem onClick={onEdit}>Edit Node</MenuItem>
      <MenuItem onClick={onDelete}>Delete Node</MenuItem>
    </ContextMenu>
  );
};

export default NodeContextMenu;
