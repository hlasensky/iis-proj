"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createConference } from "@/actions/accountActions";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

export const formConfSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  desc: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  day: z.string(),
  start: z.string(),
  end: z.string(),
  capacity: z.string(),
});

export function ConfForm(): JSX.Element {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formConfSchema>>({
    resolver: zodResolver(formConfSchema),
    defaultValues: {
      name: "",
      desc: "",
      day: `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()}`,
      start: "12:00",
      end: "15:00",
      capacity: "1",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formConfSchema>) {
    setLoading(true);
    console.log(values);
    try {
      const status = await createConference(values);
      if (status === 200) {
        console.log("Form Success!");
        setSuccess(true);
      } else {
        console.log("Form Error!");
        form.setError("name", {
          type: "manual",
          message: "An error occurred. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Název Konference</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Popis</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kapacita</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Den</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pocatek</FormLabel>
              <FormControl>
                <Input type="time" min={"00:00"} max={"23:59"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>konec</FormLabel>
              <FormControl>
                <Input type="time" min={"00:00"} max={"23:59"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className={success ? "border-green-400" : ""}>
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : success ? (
            <Check />
          ) : (
            "Vytvorit"
          )}
        </Button>
      </form>
    </Form>
  );
}
