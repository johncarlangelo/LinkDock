import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import Category from './Category';
import './GridLayout.css';

export default function GridLayout({ categories, onReorder, onRename, onDelete, onAddLink, onDeleteLink, children }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px of movement required before drag starts (reduced for faster response)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((cat) => cat.id === active.id);
      const newIndex = categories.findIndex((cat) => cat.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newCategories = [...categories];
        const [movedItem] = newCategories.splice(oldIndex, 1);
        newCategories.splice(newIndex, 0, movedItem);
        onReorder(newCategories);
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Find the active category for the DragOverlay
  const activeCategory = categories.find((cat) => cat.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={categories.map((cat) => cat.id)} strategy={rectSortingStrategy}>
        <div className="grid-layout">
          {children}
        </div>
      </SortableContext>

      <DragOverlay
        dropAnimation={{
          duration: 150,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
        style={{ transformOrigin: '0 0' }}
      >
        {activeId && activeCategory ? (
          <div style={{ 
            transform: 'rotate(-8deg)',
            cursor: 'grabbing',
            width: '100%',
            maxWidth: '450px',
            height: '400px',
          }}>
            <Category
              id={activeCategory.id}
              name={activeCategory.name}
              links={activeCategory.links || []}
              onRename={onRename}
              onDelete={onDelete}
              onAddLink={onAddLink}
              onDeleteLink={onDeleteLink}
              dragHandleProps={{}}
              isLocked={true}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
