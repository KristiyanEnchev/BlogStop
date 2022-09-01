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
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { MultiSelect } from '@/components/common/MultiSelect';
import { PenLine, Image, Tag, Bookmark, Eye, Save, ArrowLeft, Loader2, Star, Clock } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/services/auth/authSlice';

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

export default function CreateEditBlogPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const currentUser = useAppSelector(selectCurrentUser);

    const { data: post, isLoading: postLoading } = useGetBlogPostByIdQuery(id || '', {
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

    const categoryOptions = React.useMemo(() => {
        if (!categories || categories.length === 0) return [];
        return categories.map(c => ({ label: c.name, value: c.id }));
    }, [categories]);

    const tagOptions = React.useMemo(() => {
        if (!tags || tags.length === 0) return [];
        return tags.map(t => ({ label: t.name, value: t.id }));
    }, [tags]);

    const getCategoryNameById = React.useCallback((id: string) => {
        const category = categories?.find(c => c.id === id);
        return category?.name || id;
    }, [categories]);

    const getTagNameById = React.useCallback((id: string) => {
        const tag = tags?.find(t => t.id === id);
        return tag?.name || id;
    }, [tags]);

    React.useEffect(() => {
        if (post && isEditMode && categories && tags) {
            setValue('title', post.title);
            setValue('excerpt', post.excerpt);
            setValue('content', post.content);
            setValue('featuredImage', post.featuredImage || '');
            setValue('isFeatured', post.isFeatured || false);
            setValue('isPublished', post.isPublished || true);

            if (post.categories && post.categories.length > 0) {
                const categoryIds = post.categories.map(categoryName => {
                    const category = categories.find(c => c.name === categoryName);
                    return category?.id || '';
                }).filter(id => id !== '');

                setValue('categories', categoryIds);
            }

            if (post.tags && post.tags.length > 0) {
                const tagIds = post.tags.map(tagName => {
                    const tag = tags.find(t => t.name === tagName);
                    return tag?.id || '';
                }).filter(id => id !== '');

                setValue('tags', tagIds);
            }
        }
    }, [post, isEditMode, setValue, categories, tags]);

    const onSubmit = async (data: FormValues) => {
        try {
            if (!currentUser) {
                toast.error('You must be logged in to create or edit a blog post');
                return;
            }

            const generateSlug = (title: string) => {
                return title
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();
            };

            const formattedData = {
                ...data,
                slug: post?.slug || generateSlug(data.title),
                authorId: currentUser.id,
                authorName: `${currentUser.firstName} ${currentUser.lastName}`,
                categoryNames: data.categories.map(getCategoryNameById),
                tags: data.tags.map(getTagNameById)
            };

            if (isEditMode && post) {
                await updatePost({ id: post.id, blogPost: formattedData }).unwrap();
                toast.success('Post updated successfully', {
                    style: {
                        background: 'var(--success-600)',
                        color: '#ffffff',
                    },
                    iconTheme: {
                        primary: '#ffffff',
                        secondary: 'var(--success-600)',
                    },
                });
                navigate(`/${post.id}`);
            } else {
                const newPost = await createPost(formattedData).unwrap();
                toast.success('Post created successfully', {
                    style: {
                        background: 'var(--success-600)',
                        color: '#ffffff',
                    },
                    iconTheme: {
                        primary: '#ffffff',
                        secondary: 'var(--success-600)',
                    },
                });
                navigate(`/${newPost.id}`);
            }
        } catch (error) {
            toast.error('Failed to save post', {
                style: {
                    background: 'var(--error-600)',
                    color: '#ffffff',
                },
            });
        }
    };

    const content = watch('content');
    const previewContent = content || 'Nothing to preview yet...';

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4 text-light-text dark:text-dark-text">
                <div className="flex justify-center items-center min-h-[60vh]">
                    <LoadingSpinner size="large" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 text-light-text dark:text-dark-text">
            <Card className="border border-light-bg-tertiary dark:border-dark-bg-tertiary bg-light-bg dark:bg-dark-bg shadow-md">
                <CardHeader className="border-b rounded-md border-light-bg-tertiary dark:border-dark-bg-tertiary bg-light-bg-secondary dark:bg-dark-bg-secondary">
                    <div className="flex items-center gap-2">
                        <PenLine className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        <CardTitle className="text-light-text-secondary dark:text-dark-text-secondary">
                            {isEditMode ? 'Edit Post' : 'Create New Post'}
                        </CardTitle>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1">
                                <span>Title</span>
                                <span className="text-error-500">*</span>
                            </Label>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="title"
                                        placeholder="Post title"
                                        className="bg-light-bg dark:bg-dark-bg-secondary border-light-bg-tertiary dark:border-dark-bg-tertiary focus:border-primary-500 dark:focus:border-primary-400"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.title && (
                                <p className="text-sm text-error-500">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt" className="text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1">
                                <span>Excerpt</span>
                                <span className="text-error-500">*</span>
                            </Label>
                            <Controller
                                name="excerpt"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        id="excerpt"
                                        placeholder="Brief summary of your post"
                                        rows={3}
                                        className="bg-light-bg dark:bg-dark-bg-secondary border-light-bg-tertiary dark:border-dark-bg-tertiary focus:border-primary-500 dark:focus:border-primary-400"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.excerpt && (
                                <p className="text-sm text-error-500">{errors.excerpt.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="featuredImage" className="text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1">
                                <Image className="h-4 w-4" />
                                <span>Featured Image URL</span>
                            </Label>
                            <Controller
                                name="featuredImage"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="featuredImage"
                                        placeholder="https://example.com/image.jpg"
                                        className="bg-light-bg dark:bg-dark-bg-secondary border-light-bg-tertiary dark:border-dark-bg-tertiary focus:border-primary-500 dark:focus:border-primary-400"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.featuredImage && (
                                <p className="text-sm text-error-500">{errors.featuredImage.message}</p>
                            )}
                            {watch('featuredImage') && (
                                <div className="mt-2 h-48 overflow-hidden rounded-md border border-light-bg-tertiary dark:border-dark-bg-tertiary">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-light-text dark:text-dark-text flex items-center">
                                        <Bookmark className="h-4 w-4 mr-2" />
                                        Categories
                                    </Label>
                                    <Controller
                                        name="categories"
                                        control={control}
                                        render={({ field }) => (
                                            <MultiSelect
                                                options={categoryOptions}
                                                value={field.value.map(id => ({
                                                    label: getCategoryNameById(id),
                                                    value: id
                                                }))}
                                                onChange={selected => field.onChange(selected.map(item => item.value))}
                                                placeholder="Select categories"
                                                className="bg-light-bg dark:bg-dark-bg-secondary"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-light-text dark:text-dark-text flex items-center">
                                        <Tag className="h-4 w-4 mr-2" />
                                        Tags
                                    </Label>
                                    <Controller
                                        name="tags"
                                        control={control}
                                        render={({ field }) => (
                                            <MultiSelect
                                                options={tagOptions}
                                                value={field.value.map(id => ({
                                                    label: getTagNameById(id),
                                                    value: id
                                                }))}
                                                onChange={selected => field.onChange(selected.map(item => item.value))}
                                                placeholder="Select tags"
                                                className="bg-light-bg dark:bg-dark-bg-secondary"
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col justify-start pt-8">
                                <div className="flex items-center space-x-2 p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-md mb-4">
                                    <Controller
                                        name="isFeatured"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                id="isFeatured"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
                                            />
                                        )}
                                    />
                                    <Label
                                        htmlFor="isFeatured"
                                        className="text-light-text dark:text-dark-text flex items-center cursor-pointer"
                                    >
                                        <Star className="h-4 w-4 mr-2 text-amber-500" />
                                        Featured Post
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2 p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-md mb-4">
                                    <Controller
                                        name="isPublished"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                id="isPublished"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
                                            />
                                        )}
                                    />
                                    <Label
                                        htmlFor="isPublished"
                                        className="text-light-text dark:text-dark-text flex items-center cursor-pointer"
                                    >
                                        <Clock className="h-4 w-4 mr-2 text-green-500" />
                                        Publish Immediately
                                    </Label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1">
                                <span>Content</span>
                                <span className="text-error-500">*</span>
                            </Label>
                            <Tabs defaultValue="write" className="w-full">
                                <TabsList className="mb-2 bg-light-bg-secondary dark:bg-dark-bg-tertiary">
                                    <TabsTrigger value="write" className="data-[state=active]:bg-primary-100 dark:data-[state=active]:bg-primary-900/30 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400">
                                        <PenLine className="h-4 w-4 mr-1" />
                                        Write
                                    </TabsTrigger>
                                    <TabsTrigger value="preview" className="data-[state=active]:bg-primary-100 dark:data-[state=active]:bg-primary-900/30 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400">
                                        <Eye className="h-4 w-4 mr-1" />
                                        Preview
                                    </TabsTrigger>
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
                                        <p className="text-sm text-error-500">{errors.content.message}</p>
                                    )}
                                </TabsContent>
                                <TabsContent value="preview">
                                    <div
                                        className="prose prose-lg max-w-none rounded-md border border-light-bg-tertiary dark:border-dark-bg-tertiary p-4 bg-light-bg dark:bg-dark-bg-secondary dark:prose-invert prose-headings:text-light-text-secondary dark:prose-headings:text-dark-text-secondary prose-a:text-primary-600 dark:prose-a:text-primary-400"
                                        dangerouslySetInnerHTML={{ __html: previewContent }}
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t border-light-bg-tertiary dark:border-dark-bg-tertiary py-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(-1)}
                            disabled={isSaving}
                            className="border-light-bg-tertiary dark:border-dark-bg-tertiary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary text-light-text dark:text-dark-text"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            {isEditMode ? 'Update Post' : 'Create Post'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
