import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
//Get the Inferred initial type of the initialData
import { StarPicker } from "@/components/star-picker";
import { ReviewsGetOneOutPut } from "@/modules/reviews/types";
import { toast } from "sonner";

interface Props {
  productId: string;
  initialData?: ReviewsGetOneOutPut;
}
const formSchema = z.object({
  rating: z.number().min(1, { message: "Rating is required" }).max(5),
  description: z.string().min(1, { message: "Description is required" }),
});
export const ReviewForm = ({ productId, initialData }: Props) => {
  // Start in preview mode only if a review already exists (force initialData to a real boolean)
  // isPreview = true  → we're viewing/read-only mode (starts true if a review already exists)
  // isPreview = false → we're in editing mode (starts false if no review exists yet)
  const [isPreview, setIsPreview] = useState(!!initialData);

  //Mutate the form
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createReview = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.products.getOne.queryOptions({ id: productId }),
        );
        setIsPreview(true); // change to preview mode to look the edit
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
  const updateReview = useMutation(
    trpc.reviews.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.products.getOne.queryOptions({ id: productId }),
        );
        setIsPreview(true); // change to preview mode to look the edit
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialData?.rating ?? 0,
      description: initialData?.description ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (initialData) {
      updateReview.mutate({
        reviewId: initialData.id, // review exist as initialData has review.id
        description: values.description,
        rating: values.rating,
      });
    } else {
      createReview.mutate({
        productId,
        description: values.description,
        rating: values.rating,
      });
    }
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="font-medium">
          {isPreview ? "Your rating:" : "Liked it? Give it a rating"}
        </p>
        {/* FormField will carry only the formSchema values, which are "rating, description" */}
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                {/* FormControl is flexible — it accepts any custom component. We pass field.value and field.onChange to sync StarPicker with react-hook-form state */}
                <StarPicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPreview}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Want to leave a written review?"
                  disabled={isPreview}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Check if he added preview before */}
        {!isPreview && (
          <Button
            variant="elevated"
            disabled={createReview.isPending || updateReview.isPending}
            type="submit"
            size="lg"
            className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
          >
            {/* If we have initialData this button will load with Button label "Update review" -> after i click edit from the isPreview && <Button> */}
            {initialData ? "Update review" : "Post review"}
          </Button>
        )}
        {isPreview && (
          <Button
            onClick={() => setIsPreview(false)}
            size="lg"
            type="button"
            variant="elevated"
            className="w-fit"
          >
            Edit
          </Button>
        )}
      </form>
    </Form>
  );
};
