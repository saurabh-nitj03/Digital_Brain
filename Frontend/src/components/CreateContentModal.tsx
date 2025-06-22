
import { CrossIcon } from "../icons/CrossIcon"
import { Button } from "./Button"
import { forwardRef, useEffect } from "react"
import axios from "axios"
import { useState } from "react"
import { BACKEND_URL } from "../config"
import { z } from "zod";
import type { SubmitHandler } from "react-hook-form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

interface ModalProps {
    open: boolean,
    onClose: () => void
}

const ContentType = ["twitter", "youtube", "document", "image", "link"] as const;
export const contentSchema = z.object({
    title: z.string().min(1, { message: "Title cannot be empty" }),
    type: z.enum(ContentType).refine((val) => ContentType.includes(val), { message: `Type must be one of ${ContentType.join(',')}` }),
    content: z.string().max(500, { message: "Content Length must be at most 500 characters" }).optional(),
    link: z.string().trim().transform((val) => (val === "" ? undefined : val)).optional()
        .refine((val) => !val || /^https?:\/\/.+/.test(val), {
            message: "Link must be a valid URL",
        }),
    file: z.any().optional() 
});

type TContentSchema = z.infer<typeof contentSchema>;

const CreateContentModal = (props: ModalProps) => {
    const [error, setError] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<TContentSchema>({
        resolver: zodResolver(contentSchema)
    });

    const watchedType = watch("type");

    const onSubmit: SubmitHandler<TContentSchema> = async (data) => {
        console.log(data);
        setIsSubmitting(true);
        setError(null);
        
        try {
            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("type", data.type);
            
            if (data.content) {
                formData.append("content", data.content);
            }
            
            if (data.link) {
                formData.append("link", data.link);
            }
            if(typeof tags ==="string"){
                setTags([tags]);
            }
            if (tags.length > 0) {
                tags.forEach((tag) => formData.append("tags", tag));
            }
            
            // Handle file upload
            if (data.file && data.file[0] instanceof File) {
                formData.append("file", data.file[0]);
            }
            // console.log(formData)
            for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
}
            const response = await axios.post(`${BACKEND_URL}/api/v1/content`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });


            if (response.data.success) {
                props.onClose();
                setTags([]);
                reset();
            } else {
                setError(response.data.message || "Failed to create content");
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "An error occurred while creating content");
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && e.currentTarget.value && e.currentTarget.value.trim() !== "") {
            e.preventDefault();
            e.stopPropagation();
            const newTag = e.currentTarget.value.trim();
            if (!tags.includes(newTag) && tags.length < 10) {
                setTags([...tags, newTag]);
            }
            e.currentTarget.value = "";
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    // Clear error when modal closes
    useEffect(() => {
        if (!props.open) {
            setError(null);
            setTags([]);
        }
    }, [props.open]);

    return (
        <div>
            {props.open && (
                <div className="w-screen h-screen top-0 left-0 fixed flex justify-center items-center">
                    <div className="absolute w-full h-full bg-slate-500 opacity-60 z-10"></div>
                    <div className="flex flex-col justify-center gap-8 z-20 min-w-84 w-96">
                        <div className="bg-white opacity-100 p-4 rounded-md">
                            <div className="flex justify-between items-center mb-2">
                                <div className="col-span-11 text-center text-2xl font-semibold">
                                    Content Details
                                </div>
                                <div onClick={props.onClose} className="cursor-pointer">
                                    <CrossIcon />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <Input 
                                        placeholder="Title" 
                                        {...register("title")} 
                                        width={true} 
                                        rounded={true} 
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <select 
                                        {...register("type")}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        defaultValue=""
                                    >
                                        <option value="">Select Type</option>
                                        {ContentType.map((type) => (
                                            <option key={type} value={type}>
                                                {type.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.type && (
                                        <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                                    )}
                                </div>

                                {(watchedType === "youtube" || watchedType === "twitter" || watchedType === "link") && (
                                    <div className="mb-4">
                                        <Input 
                                            placeholder="Link (optional)" 
                                            {...register("link")} 
                                            width={true} 
                                            rounded={true} 
                                        />
                                        {errors.link && (
                                            <p className="text-sm text-red-600">{errors.link.message}</p>
                                        )}
                                    </div>
                                )}

                                {(watchedType === "image" || watchedType === "document") && (
                                    <div className="mb-4">
                                        <Input 
                                            type="file" 
                                            width={true} 
                                            rounded={true} 
                                            {...register("file")}
                                            accept={watchedType === "image" ? "image/*" : watchedType === "document" ? ".pdf,.doc,.docx" : ""}
                                        />
                                        {/* {errors.file && (
                                            <p className="text-sm text-red-600">{errors.file.message}</p>
                                        )} */}
                                    </div>
                                )}

                                <div className="mb-4">
                                    <textarea
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Add Content (optional)"
                                        rows={3}
                                        {...register("content")}
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-red-600">{errors.content.message}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <Input 
                                        placeholder="Add tags (Press Enter)" 
                                        type="text"
                                        width={true} 
                                        rounded={true} 
                                        onKeyDown={handleAddTags} 
                                    />
                                    {tags.length >= 10 && (
                                        <p className="text-sm text-red-600 mt-1">Maximum 10 tags allowed</p>
                                    )}
                                    <div className="flex flex-wrap gap-2 ">
                                        {tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="bg-slate-200 opacity-70 px-3 text-center rounded-full text-sm"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="pl-1 hover:text-red-600"
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <Button 
                                        variant="primary" 
                                        size="md" 
                                        text={isSubmitting ? "Creating..." : "Create Content"}
                                        type="submit" 
                                        width={true}
                                        // disabled={isSubmitting}
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-red-600 text-center mt-3">{error}</p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

interface InputProps {
    placeholder?: string;
    label?: string;
    reference?: any;
    rounded?: boolean;
    width?: boolean;
    onKeyDown?: any;
    type?: string;
    accept?: string;
    disabled?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ placeholder, label, rounded, reference, width, onKeyDown, type = "text", accept, disabled, ...rest }, ref) => {
        return (
            <div className="flex items-center gap-4 py-3 w-full">
                {label && <label htmlFor={label}>{label} :</label>}
                <input
                    id={label}
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    accept={accept}
                    disabled={disabled}
                    className={`px-3 py-2 border ${rounded ? 'rounded-md' : ''} ${width ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onKeyDown={onKeyDown}
                    {...rest}
                />
            </div>
        );
    }
);

export default CreateContentModal;