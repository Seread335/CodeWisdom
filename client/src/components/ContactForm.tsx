import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  subject: z.string().min(3, { message: "Chủ đề phải có ít nhất 3 ký tự" }),
  message: z.string().min(10, { message: "Nội dung phải có ít nhất 10 ký tự" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Gửi tin nhắn thành công!",
        description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể gửi tin nhắn của bạn. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-6">Gửi tin nhắn</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Họ và tên</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nhập họ và tên của bạn" 
                    {...field} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nhập địa chỉ email của bạn" 
                    type="email" 
                    {...field} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Chủ đề</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nhập chủ đề" 
                    {...field} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Nội dung</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Nhập nội dung tin nhắn của bạn" 
                    rows={5} 
                    {...field} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-blue-600 transition"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
