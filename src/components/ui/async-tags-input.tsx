import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  ChangeEvent,
  KeyboardEventHandler,
  ClipboardEventHandler,
} from "react";
import { Badge } from "./badge";
import { Check, Loader2, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover"; // Import Popover components

// Define the structure for a tag object
interface Tag {
  id: string;
  label: string;
}

interface AsyncTagInputProps {
  value: Tag[]; // Changed to Tag[]
  onChange: (value: Tag[]) => void; // Changed to Tag[]
  placeholder?: string;
  maxItems?: number;
  minItems?: number;
  suggestions?: Tag[]; // Changed to Tag[]
  fecther?: (query: string) => Promise<Tag[]>; // Changed to Promise<Tag[]>
  debounceDelay?: number;
  className?: string;
  disabled?: boolean;
  createOnEnter?: boolean;
  createOnComma?: boolean;
  createOnSpace?: boolean;
}

const AsyncTagsInput = ({
  value = [],
  onChange,
  placeholder = "Type to add tags...",
  maxItems = Infinity,
  minItems = 0,
  suggestions = [],
  fecther,
  debounceDelay = 300,
  className,
  disabled = false,
  createOnEnter = true,
  createOnComma = true,
  createOnSpace = false,
  ...props
}: AsyncTagInputProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Tag[]>([]); // Changed to Tag[]
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedInputValue = useDebounce(inputValue, debounceDelay);

  // Helper to check if a tag (by label or ID) already exists in the current value
  const tagExists = useCallback(
    (tagToFind: string | Tag): boolean => {
      if (typeof tagToFind === "string") {
        return value.some((tag) => tag.label === tagToFind);
      }
      return value.some((tag) => tag.id === tagToFind.id || tag.label === tagToFind.label);
    },
    [value]
  );

  // Filter suggestions based on input (for static suggestions)
  useEffect(() => {
    if (!fecther && inputValue.trim()) {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion.label.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tagExists(suggestion)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestionIndex(-1);
    } else if (!fecther && !inputValue.trim()) {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  }, [inputValue, suggestions, tagExists, fecther]);

  // Handle async search with debouncing
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (fecther && debouncedInputValue.trim()) {
        setIsLoading(true);
        setShowSuggestions(true);

        try {
          const results = await fecther(debouncedInputValue);
          const filtered = results.filter((result) => !tagExists(result));
          setFilteredSuggestions(filtered);
          if (filtered.length > 0 || inputValue.trim()) {
            setShowSuggestions(true);
          } else {
            setShowSuggestions(false);
          }
          setSelectedSuggestionIndex(-1);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setFilteredSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setIsLoading(false);
        }
      } else if (fecther && !debouncedInputValue.trim()) {
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedInputValue, fecther, tagExists, inputValue]);

  // Add new tag
  const addTag = useCallback<(tag: Tag | string) => void>(
    (tag) => {
      let newTag: Tag | null = null;

      if (typeof tag === "string") {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tagExists(trimmedTag) && value.length < maxItems) {
          // For newly created tags, you might need a way to generate a unique ID.
          // For simplicity, here we'll use the label as the ID. In a real app,
          // you might want to generate a UUID or get it from a backend.
          newTag = { id: trimmedTag.toLowerCase().replace(/\s+/g, '-'), label: trimmedTag };
        }
      } else {
        if (!tagExists(tag) && value.length < maxItems) {
          newTag = tag;
        }
      }

      if (newTag) {
        onChange([...value, newTag]);
        setInputValue("");
        setSelectedSuggestionIndex(-1);
        inputRef.current?.focus();
        setShowSuggestions(false);
      }
    },
    [value, onChange, maxItems, tagExists]
  );

  // Remove tag
  const removeTag = useCallback<(tagToRemove: Tag) => void>(
    (tagToRemove) => {
      if (value.length > minItems) {
        onChange(value.filter((tag) => tag.id !== tagToRemove.id));
      }
    },
    [value, onChange, minItems]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (e) => {
      const target = e.currentTarget;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (showSuggestions) {
            setSelectedSuggestionIndex((prev) =>
              prev < filteredSuggestions.length - 1 ? prev + 1 : 0
            );
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (showSuggestions) {
            setSelectedSuggestionIndex((prev) =>
              prev > 0 ? prev - 1 : filteredSuggestions.length - 1
            );
          }
          break;

        case "ArrowLeft":
          if (target.selectionStart === 0 && value.length > 0) {
            e.preventDefault();
            setActiveIndex((prev) =>
              prev === -1 ? value.length - 1 : Math.max(0, prev - 1)
            );
            setShowSuggestions(false);
          }
          break;

        case "ArrowRight":
          if (activeIndex !== -1) {
            e.preventDefault();
            setActiveIndex((prev) => (prev < value.length - 1 ? prev + 1 : -1));
            if (activeIndex === value.length - 1) {
              inputRef.current?.focus();
            }
          }
          break;

        case "Enter":
          e.preventDefault();
          if (showSuggestions && selectedSuggestionIndex >= 0) {
            addTag(filteredSuggestions[selectedSuggestionIndex]);
          } else if (createOnEnter && inputValue.trim()) {
            addTag(inputValue); // Add as string, will be converted to Tag object
          }
          break;

        case ",":
          if (createOnComma) {
            e.preventDefault();
            if (inputValue.trim()) {
              addTag(inputValue); // Add as string
            }
          }
          break;

        case " ":
          if (createOnSpace && inputValue.trim() && !showSuggestions) {
            e.preventDefault();
            addTag(inputValue); // Add as string
          }
          break;

        case "Backspace":
          if (activeIndex !== -1) {
            e.preventDefault();
            removeTag(value[activeIndex]);
            setActiveIndex((prev) => Math.min(prev, value.length - 2));
          } else if (target.selectionStart === 0 && value.length > 0) {
            e.preventDefault();
            removeTag(value[value.length - 1]);
          }
          break;

        case "Delete":
          if (activeIndex !== -1) {
            e.preventDefault();
            removeTag(value[activeIndex]);
            setActiveIndex((prev) => Math.min(prev, value.length - 2));
          }
          break;

        case "Escape":
          setShowSuggestions(false);
          setActiveIndex(-1);
          setSelectedSuggestionIndex(-1);
          break;
      }
    },
    [
      showSuggestions,
      selectedSuggestionIndex,
      filteredSuggestions,
      activeIndex,
      value,
      inputValue,
      addTag,
      removeTag,
      createOnEnter,
      createOnComma,
      createOnSpace,
    ]
  );

  // Handle paste
  const handlePaste = useCallback<ClipboardEventHandler<HTMLInputElement>>(
    (e) => {
      e.preventDefault();
      const pastedText = e.clipboardData?.getData("text") ?? "";
      const potentialTags = pastedText
        .split(/[\n,;|\t]+/)
        .map((tag) => tag.trim())
        .filter(Boolean);

      const newTags: Tag[] = [...value];
      potentialTags.forEach((pastedTagLabel) => {
        // For pasted tags, generate a simple ID.
        // In a real application, you might want more sophisticated ID generation or a confirmation step.
        const newTag: Tag = { id: pastedTagLabel.toLowerCase().replace(/\s+/g, '-'), label: pastedTagLabel };
        if (!tagExists(newTag) && newTags.length < maxItems) {
          newTags.push(newTag);
        }
      });

      onChange(newTags);
      setInputValue("");
    },
    [value, onChange, maxItems, tagExists]
  );

  // Handle input change
  const handleInputChange = useCallback<
    (e: ChangeEvent<HTMLInputElement>) => void
  >((e) => {
    setInputValue(e.target.value);
    setActiveIndex(-1);
    setShowSuggestions(true);
  }, []);

  const handleSuggestionClick = useCallback<(suggestion: Tag) => void>(
    (suggestion) => {
      addTag(suggestion);
    },
    [addTag]
  );

  // Handle container click (to focus input)
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
    setActiveIndex(-1);
  }, []);

  const canRemoveTag = value.length > minItems;
  const canAddTag = value.length < maxItems;

  return (
    <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
      <PopoverAnchor asChild>
        <div
          ref={containerRef}
          className={cn(
            "flex flex-wrap items-center gap-1 rounded-lg text-sm",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          onClick={handleContainerClick}
          {...props}
        >
          {value.map((tag, index) => (
            <Badge
              key={tag.id} // Use tag.id for key
              variant="secondary"
              className={cn(
                "flex items-center gap-1 pr-1",
                activeIndex === index && "ring-2 ring-primary ring-offset-1",
                !canRemoveTag && "opacity-60"
              )}
            >
              <span>{tag.label}</span> {/* Display tag.label */}
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                disabled={!canRemoveTag || disabled}
                className="rounded-full p-0.5 hover:bg-muted-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed size-5"
                aria-label={`Remove ${tag.label}`}
                variant={"ghost"}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={() => setShowSuggestions(false)}
            placeholder={value.length === 0 ? placeholder : ""}
            disabled={!canAddTag || disabled}
            className={cn(
              "flex-1 min-w-[120px] border-none outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
              "focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
            autoComplete="off"
          />
        </div>
      </PopoverAnchor>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-1 mt-1 max-h-60 overflow-auto"
        side="bottom"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">
              Loading suggestions...
            </span>
          </div>
        ) : (
          <>
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={suggestion.id} // Use suggestion.id for key
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                  "hover:bg-accent hover:text-accent-foreground",
                  selectedSuggestionIndex === index &&
                    "bg-accent text-accent-foreground"
                )}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Check className="mr-2 h-4 w-4 opacity-0" />
                {suggestion.label} {/* Display suggestion.label */}
              </div>
            ))}

            {/* Create new option */}
            {inputValue.trim() &&
              !tagExists(inputValue.trim()) && ( // Check if label exists
                <div
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    filteredSuggestions.length > 0 &&
                      "border-t border-border mt-1 pt-2"
                  )}
                  onClick={() => addTag(inputValue)}
                >
                  <Check className="mr-2 h-4 w-4 opacity-0" />
                  <span className="text-sm text-muted-foreground">
                    Press Enter or Click to create{" "}
                    <span className="font-semibold dark:text-white text-black">
                      "{inputValue.trim()}"
                    </span>
                  </span>
                </div>
              )}

            {/* No results message */}
            {!isLoading &&
              filteredSuggestions.length === 0 &&
              inputValue.trim() &&
              fecther && (
                <div className="flex items-center justify-center py-4">
                  <span className="text-sm text-muted-foreground">
                    No suggestions found
                  </span>
                </div>
              )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default AsyncTagsInput;