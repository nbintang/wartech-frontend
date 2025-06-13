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

interface AsyncTagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  minItems?: number;
  suggestions?: string[];
  onSearch?: (query: string) => Promise<string[]>;
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
  onSearch,
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
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Use debounced value for API calls
  const debouncedInputValue = useDebounce(inputValue, debounceDelay);

  // Filter suggestions based on input (for static suggestions)
  useEffect(() => {
    if (!onSearch && inputValue.trim()) {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !value.includes(suggestion)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestionIndex(-1);
    } else if (!onSearch && !inputValue.trim()) {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  }, [inputValue, suggestions, value, onSearch]);

  // Handle async search with debouncing
  useEffect(() => {
    if (onSearch && debouncedInputValue.trim()) {
      setIsLoading(true);
      setShowSuggestions(true);

      onSearch(debouncedInputValue)
        .then((results) => {
          const filtered = results.filter((result) => !value.includes(result));
          setFilteredSuggestions(filtered);
          setShowSuggestions(true);
          setSelectedSuggestionIndex(-1);
        })
        .catch((error) => {
          console.error("Error fetching suggestions:", error);
          setFilteredSuggestions([]);
          setShowSuggestions(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (onSearch && !debouncedInputValue.trim()) {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      setIsLoading(false);
    }
  }, [debouncedInputValue, onSearch, value]);

  // Add new tag
  const addTag = useCallback<(key: string) => void>(
    (tag) => {
      const trimmedTag = tag.trim();
      if (
        trimmedTag &&
        !value.includes(trimmedTag) &&
        value.length < maxItems
      ) {
        onChange([...value, trimmedTag]);
        setInputValue("");
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.focus();
      }
    },
    [value, onChange, maxItems]
  );

  // Remove tag
  const removeTag = useCallback<(tagToRemove: string) => void>(
    (tagToRemove) => {
      if (value.length > minItems) {
        onChange(value.filter((tag) => tag !== tagToRemove));
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
            addTag(inputValue);
          }
          break;

        case ",":
          if (createOnComma) {
            e.preventDefault();
            if (inputValue.trim()) {
              addTag(inputValue);
            }
          }
          break;

        case " ":
          if (createOnSpace && inputValue.trim() && !showSuggestions) {
            e.preventDefault();
            addTag(inputValue);
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
      const tags = pastedText
        .split(/[\n,;|\t]+/)
        .map((tag) => tag.trim())
        .filter(Boolean);

      const newTags = [...value];
      tags.forEach((tag) => {
        if (!newTags.includes(tag) && newTags.length < maxItems) {
          newTags.push(tag);
        }
      });

      onChange(newTags);
      setInputValue("");
    },
    [value, onChange, maxItems]
  );

  // Handle input change
  const handleInputChange = useCallback<
    (e: ChangeEvent<HTMLInputElement>) => void
  >((e) => {
    setInputValue(e.target.value);
    setActiveIndex(-1);
  }, []);

  // Handle suggestion click
  const handleSuggestionClick = useCallback<(suggestion: string) => void>(
    (suggestion) => {
      addTag(suggestion);
    },
    [addTag]
  );

  // Handle container click
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
    setActiveIndex(-1);
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const canRemoveTag = value.length > minItems;
  const canAddTag = value.length < maxItems;

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={cn(
          "flex flex-wrap items-center gap-1 p-2 min-h-[2.5rem] rounded-lg border border-input bg-transparent text-sm ring-offset-background",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={handleContainerClick}
        {...props}
      >
        {value.map((tag, index) => (
          <Badge
            key={`${tag}-${index}`}
            variant="secondary"
            className={cn(
              "flex items-center gap-1 pr-1",
              activeIndex === index && "ring-2 ring-primary ring-offset-1",
              !canRemoveTag && "opacity-60"
            )}
          >
            <span>{tag}</span>
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              disabled={!canRemoveTag || disabled}
              className="rounded-full p-0.5 hover:bg-muted-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed size-5"
              aria-label={`Remove ${tag}`}
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
          onFocus={() => setActiveIndex(-1)}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={!canAddTag || disabled}
          className={cn(
            "flex-1 min-w-[120px]  border-none outline-none placeholder:text-white disabled:cursor-not-allowed",
            "focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          )}
          autoComplete="off"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
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
                  key={suggestion}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    selectedSuggestionIndex === index &&
                      "bg-accent text-accent-foreground"
                  )}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Check className="mr-2 h-4 w-4 opacity-0" />
                  {suggestion}
                </div>
              ))}

              {/* Create new option */}
              {inputValue.trim() &&
                !filteredSuggestions.includes(inputValue.trim()) && (
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
                    Create "{inputValue.trim()}"
                  </div>
                )}

              {/* No results message */}
              {!isLoading &&
                filteredSuggestions.length === 0 &&
                inputValue.trim() &&
                onSearch && (
                  <div className="flex items-center justify-center py-4">
                    <span className="text-sm text-muted-foreground">
                      No suggestions found
                    </span>
                  </div>
                )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AsyncTagsInput;
