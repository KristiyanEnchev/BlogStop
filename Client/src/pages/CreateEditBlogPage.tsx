import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import {
    useGetBlogPostByIdQuery,
    useCreateBlogPostMutation,
    useUpdateBlogPostMutation,
    useGetCategoriesQuery,
    useGetTagsQuery
} from '@/services/blog/blogApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { MultiSelect } from '@/components/common/MultiSelect';

const blogPostSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
    excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(300, 'Excerpt must be less than 300 characters'),
    content: z.string().min(50, 'Content must be at least 50 characters'),
    featuredImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    isFeatured: z.boolean().default(false),
    isPublished: z.boolean().default(true),
    categories: z.array(z.string()).min(1, 'Select at least one category'),
    tags: z.array(z.string()),
});

type FormValues = z.infer<typeof blogPostSchema>;

export function CreateEditBlogPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const isEditMode = Boolean(slug);

    const { data: post, isLoading: postLoading } = useGetBlogPostByIdQuery(slug || '', {
        skip: !isEditMode,
    });

    const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
    const { data: tags, isLoading: tagsLoading } = useGetTagsQuery();

    const [createPost, { isLoading: isCreating }] = useCreateBlogPostMutation();
    const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();

    const isLoading = postLoading || categoriesLoading || tagsLoading;
    const isSaving = isCreating || isUpdating;

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(blogPostSchema),
        defaultValues: {
            title: '',
            excerpt: '',
            content: '',
            featuredImage: '',
            isFeatured: false,
            isPublished: true,
            categories: [],
            tags: [],
        },
    });

    React.useEffect(() => {
        if (post && isEditMode) {
            setValue('title', post.title);
            setValue('excerpt', post.excerpt);
            setValue('content', post.content);
            setValue('featuredImage', post.featuredImage);
            setValue('isFeatured', post.isFeatured);
            setValue('isPublished', post.isPublished);
            setValue('categories', post.categories);
            setValue('tags', post.tags);
        }
    }, [post, isEditMode, setValue]);

    const onSubmit = async (data: FormValues) => {
        try {
            if (isEditMode && post) {
                await updatePost({ id: post.id, blogPost: data }).unwrap();
                toast.success('Post updated successfully');
            } else {
                const newPost = await createPost(data).unwrap();
                toast.success('Post created successfully');
                navigate(`/blog/${newPost.slug}`);
            }
        } catch (error) {
            toast.error('Failed to save post');
        }
    };

    const categoryOptions = categories?.map(c => ({ label: c.name, value: c.name })) || [];
    const tagOptions = tags?.map(t => ({ label: t.name, value: t.name })) || [];

    const content = watch('content');
    const previewContent = content || 'Nothing to preview yet...';

    if (isLoading) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>{isEditMode ? 'Edit Post' : 'Create New Post'}</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <Input id="title" placeholder="Post title" {...field} />
                                )}
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Controller
                                name="excerpt"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        id="excerpt"
                                        placeholder="Brief summary of your post"
                                        rows={3}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.excerpt && (
                                <p className="text-sm text-destructive">{errors.excerpt.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="featuredImage">Featured Image URL</Label>
                            <Controller
                                name="featuredImage"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="featuredImage"
                                        placeholder="https://example.com/image.jpg"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.featuredImage && (
                                <p className="text-sm text-destructive">{errors.featuredImage.message}</p>
                            )}
                            {watch('featuredImage') && (
                                <div className="mt-2 h-48 overflow-hidden rounded-md">
                                    <img
                                        src={watch('featuredImage')}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Categories</Label>
                                <Controller
                                    name="categories"
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={categoryOptions}
                                            value={field.value.map(v => ({ label: v, value: v }))}
                                            onChange={(selected) => field.onChange(selected.map(s => s.value))}
                                            placeholder="Select categories"
                                        />
                                    )}
                                />
                                {errors.categories && (
                                    <p className="text-sm text-destructive">{errors.categories.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <Controller
                                    name="tags"
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect
                                            options={tagOptions}
                                            value={field.value.map(v => ({ label: v, value: v }))}
                                            onChange={(selected) => field.onChange(selected.map(s => s.value))}
                                            placeholder="Select tags"
                                            allowCreate
                                        />
                                    )}
                                />
                                {errors.tags && (
                                    <p className="text-sm text-destructive">{errors.tags.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <Controller
                                    name="isFeatured"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            id="isFeatured"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                <Label htmlFor="isFeatured">Featured Post</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Controller
                                    name="isPublished"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            id="isPublished"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                <Label htmlFor="isPublished">Publish Immediately</Label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Content</Label>
                            <Tabs defaultValue="write">
                                <TabsList className="mb-2">
                                    <TabsTrigger value="write">Write</TabsTrigger>
                                    <TabsTrigger value="preview">Preview</TabsTrigger>
                                </TabsList>
                                <TabsContent value="write" className="space-y-2">
                                    <Controller
                                        name="content"
                                        control={control}
                                        render={({ field }) => (
                                            <RichTextEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Write your post content here..."
                                            />
                                        )}
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-destructive">{errors.content.message}</p>
                                    )}
                                </TabsContent>
                                <TabsContent value="preview">
                                    <div
                                        className="prose prose-lg max-w-none rounded-md border p-4 dark:prose-invert"
                                        dangerouslySetInnerHTML={{ __html: previewContent }}
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(-1)}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <i className="ri-loader-4-line mr-2 animate-spin"></i>}
                            {isEditMode ? 'Update Post' : 'Create Post'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
