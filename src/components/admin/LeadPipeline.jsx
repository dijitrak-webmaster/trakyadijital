import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { AlertTriangle, GripVertical } from 'lucide-react';
import { STATUS, TYPE } from '@/components/admin/leadMeta';

const isStale = (l) => (l.status || 'new') === 'new' && Date.now() - new Date(l.created_date).getTime() > 3 * 86400000;

// Sürükle-bırak satış panosu: kartı sürükleyerek durum kolonunu değiştir.
export default function LeadPipeline({ leads, onOpen, onMove }) {
  const onDragEnd = (r) => {
    if (!r.destination) return;
    const lead = leads.find((l) => l.id === r.draggableId);
    if (lead && (lead.status || 'new') !== r.destination.droppableId) onMove(lead.id, r.destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(STATUS).map(([key, s]) => {
          const col = leads.filter((l) => (l.status || 'new') === key);
          return (
            <Droppable key={key} droppableId={key}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[260px] rounded-2xl border p-3 transition-colors ${snapshot.isDraggingOver ? 'border-mint/60 bg-mint/10' : 'border-border bg-card/40'}`}
                >
                  <div className="flex items-center justify-between px-1 pb-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`}>{s.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">{col.length}</span>
                  </div>
                  <div className="space-y-2">
                    {col.map((l, i) => (
                      <Draggable key={l.id} draggableId={l.id} index={i}>
                        {(p, snap) => (
                          <div
                            ref={p.innerRef}
                            {...p.draggableProps}
                            className={`rounded-xl border border-border bg-card p-3 ${snap.isDragging ? 'shadow-sticker border-mint/60' : ''}`}
                          >
                            <div className="flex items-center gap-2" {...p.dragHandleProps}>
                              <GripVertical className="w-3.5 h-3.5 text-muted-foreground cursor-grab shrink-0" />
                              <button onClick={() => onOpen(l)} className="font-semibold text-sm truncate hover:text-mint transition-colors">{l.name}</button>
                            </div>
                            <p className="font-mono text-[10px] text-muted-foreground truncate mt-1 pl-6">{l.service || TYPE[l.type] || ''}</p>
                            {isStale(l) && (
                              <span className="inline-flex items-center gap-1 mt-2 ml-6 rounded-full bg-coral/15 text-coral font-mono text-[10px] px-2 py-0.5">
                                <AlertTriangle className="w-3 h-3" /> 3+ gün
                              </span>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {col.length === 0 && <p className="text-center font-mono text-xs text-muted-foreground py-6">boş</p>}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}