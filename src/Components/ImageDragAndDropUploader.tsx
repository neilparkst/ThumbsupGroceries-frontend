import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
  } from "@dnd-kit/core";
  import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
  } from "@dnd-kit/sortable";
  import { CSS } from "@dnd-kit/utilities";
  import './Styles/ImageDragAndDropUploader.scss';
import { Button } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
  
  type ImageDragAndDropUploaderProps = {
    images: File[];
    onImagesChange: (files: File[]) => void;
  };
  
  export default function ImageDragAndDropUploader({ images, onImagesChange }: ImageDragAndDropUploaderProps) {
    const handleFilesAdded = (fileList: FileList | File[]) => {
      const newFiles = Array.from(fileList).filter(file => file.type.startsWith("image/"));
      onImagesChange([...images, ...newFiles]);
    };
  
    const handleDropFiles = (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files) {
        handleFilesAdded(e.dataTransfer.files);
      }
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFilesAdded(e.target.files);
      }
    };
  
    const handleRemove = (index: number) => {
      const updated = [...images];
      updated.splice(index, 1);
      onImagesChange(updated);
    };
  
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8, // Drag after 8px move
        },
      })
    );
  
    const handleDragEnd = (event: any) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const oldIndex = images.findIndex((_, idx) => idx.toString() === active.id);
        const newIndex = images.findIndex((_, idx) => idx.toString() === over.id);
        const reordered = arrayMove(images, oldIndex, newIndex);
        onImagesChange(reordered);
      }
    };
  
    return (
      <div
        onDrop={handleDropFiles}
        onDragOver={(e) => e.preventDefault()}
        className="ImageDragAndDropUploaderContainer"
      >
        {images.length === 0 &&<>
          Drag & drop images here
          <br />
          or click to upload
          <br />
          <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              style={{marginTop: 20}}
          >
              Upload Images
              <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={handleInputChange}
              />
          </Button>
        </>
        }
  
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={images.map((_, idx) => idx.toString())} // use string IDs
            strategy={verticalListSortingStrategy}
          >
            <div className="SortableContext">
              {images.map((file, index) => (
                <SortableImage
                  key={index}
                  id={index.toString()}
                  file={file}
                  onRemove={() => handleRemove(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    );
  }
  
  type SortableImageProps = {
    id: string;
    file: File;
    onRemove: () => void;
  };
  
  function SortableImage({ id, file, onRemove }: SortableImageProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
    return (
      <div ref={setNodeRef} className="SortableImageContainer" {...attributes} {...listeners}>
        <img 
          src={URL.createObjectURL(file)}
          alt="preview"
          className="SortableImage"
          style={{
            transform: CSS.Transform.toString(transform),
            transition
          }}
        />
        <button
          type="button"
          onClick={onRemove}
          className="SortableRemoveButton"
        >
          ×
        </button>
      </div>
    );
  }
  