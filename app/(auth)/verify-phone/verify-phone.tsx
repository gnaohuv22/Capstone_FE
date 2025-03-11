'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Schema cho form xác thực số điện thoại
const verifyPhoneSchema = z.object({
  phone: z.string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ')
})

export function VerifyPhone() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');

  // Form xác thực số điện thoại
  const form = useForm<z.infer<typeof verifyPhoneSchema>>({
    resolver: zodResolver(verifyPhoneSchema),
    defaultValues: {
      phone: ''
    }
  })

  // Xử lý gửi số điện thoại
  const onSubmit = async (values: z.infer<typeof verifyPhoneSchema>) => {
    // TODO: Gọi API gửi OTP đến số điện thoại
    console.log(values)
    setStep('otp')
  }

  // Xử lý xác thực OTP
  const handleVerifyOTP = async () => {
    // TODO: Gọi API xác thực OTP
    console.log('OTP:', otp)
    setIsSubmitted(true)
    // Sau khi xác thực thành công, chuyển hướng về trang chủ sau 3 giây
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Xác thực số điện thoại</CardTitle>
            <CardDescription className="text-center">
              {step === 'phone' 
                ? 'Nhập số điện thoại của phụ huynh để xác thực tài khoản'
                : 'Nhập mã OTP đã được gửi đến số điện thoại phụ huynh'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="space-y-4 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
                <Alert>
                  <AlertDescription>
                    Xác thực số điện thoại thành công! 
                    Bạn sẽ được chuyển hướng về trang chủ sau 3 giây.
                  </AlertDescription>
                </Alert>
              </div>
            ) : step === 'phone' ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại phụ huynh</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="Ví dụ: 0987654321"
                          />
                        </FormControl>
                        <FormDescription>
                          Số điện thoại này sẽ được sử dụng để liên hệ và xác thực tài khoản
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!form.formState.isValid || form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      "Đang gửi..."
                    ) : (
                      "Gửi mã xác thực"
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Mã OTP</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nhập mã OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                  </FormControl>
                  <FormDescription className="text-center">
                    Mã OTP đã được gửi đến số điện thoại phụ huynh
                  </FormDescription>
                </FormItem>

                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={otp.length !== 6}
                    className="w-full"
                  >
                    Xác nhận
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStep('phone')}
                    className="w-full"
                  >
                    Quay lại
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 