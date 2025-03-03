import { UploadCloud, X } from "lucide-react";
import React, {
  ChangeEvent,
  ChangeEventHandler,
  useRef,
  useState,
  useEffect,
} from "react";

export default function ImageField({
  name,
  onChange,
  image,
  onClear,
  showClearButton = true,
}: {
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  image?: File | null;
  onClear?: () => void;
  showClearButton?: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePaste = (event: ClipboardEvent) => {
    const items = event.clipboardData?.items || [];

    for (let i = 0; i < items.length; i++) {
      console.log(items[i]);
      if (items[i].type.includes("image")) {
        const blob = items[i].getAsFile();
        if (blob) {
          const file = new File([blob], "pasted-image.png", {
            type: "image/png",
          });
          setFile(file);
          setPreview(URL.createObjectURL(file));

          // Update the file input
          if (fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInputRef.current.files = dataTransfer.files;

            // Trigger onChange event
            const changeEvent = new Event("change", { bubbles: true });
            fileInputRef.current.dispatchEvent(changeEvent);
          }
        }
        break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  // Handle external image prop changes
  useEffect(() => {
    if (image && image !== file) {
      setFile(image);
      setPreview(URL.createObjectURL(image));

      // Update the file input and trigger onChange
      if (fileInputRef.current && onChange) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(image);
        fileInputRef.current.files = dataTransfer.files;

        // Create and dispatch a synthetic change event
        const event = new Event("change", { bubbles: true }) as any;
        Object.defineProperty(event, "target", {
          writable: false,
          value: { files: dataTransfer.files },
        });
        onChange(event);
      }
    }
  }, [image, onChange]);

  useEffect(() => {
    // Clean up the preview URL when the component unmounts or when a new file is selected
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreview(null);
    }

    onChange?.(event);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label htmlFor="dropzone-file" className="block w-full">
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Uploaded file preview"
              className="w-full h-auto rounded-lg shadow-md"
            />
            {showClearButton && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  // Clear the file and preview
                  setFile(null);
                  setPreview(null);

                  // Reset the file input
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";

                    // Create and dispatch a synthetic change event
                    if (onChange) {
                      const event = new Event("change", {
                        bubbles: true,
                      }) as any;
                      Object.defineProperty(event, "target", {
                        writable: false,
                        value: { files: new DataTransfer().files },
                      });
                      onChange(event);
                    }
                  }

                  // Call the onClear callback if provided
                  if (onClear) {
                    onClear();
                  }
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-all"
                aria-label="Clear image"
              >
                <X size={24} className="text-white" />
              </button>
            )}
          </div>
        )}
        {!preview && (
          <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 ">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full">
              <UploadCloud />
              <p className="mb-2 text-sm text-gray-300 ">
                <span className="font-semibold">Click to upload</span> or paste
                an image
              </p>
              <p className="text-xs text-gray-300 ">PNG or JPG (MAX. 6MB)</p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          id="dropzone-file"
          type="file"
          name={name}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
      </label>
    </div>
  );
}
