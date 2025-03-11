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
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Schema cho form quên mật khẩu
const forgotPasswordSchema = z.object({
  username: z.string()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(50, 'Tên đăng nhập không được vượt quá 50 ký tự'),
  parentPhone: z.string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ')
})

export function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState<'verify' | 'otp'>('verify');
  const [otp, setOtp] = useState('');

  // Form quên mật khẩu
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      username: '',
      parentPhone: ''
    }
  })

  // Xử lý gửi yêu cầu đặt lại mật khẩu
  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    // TODO: Gọi API kiểm tra username và số điện thoại
    console.log(values)
    setStep('otp')
  }

  // Xử lý xác thực OTP
  const handleVerifyOTP = async () => {
    // TODO: Gọi API xác thực OTP
    console.log('OTP:', otp)
    setIsSubmitted(true)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/login"
        className="absolute left-4 top-4 flex items-center text-sm text-muted-foreground hover:text-primary md:left-8 md:top-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại đăng nhập
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Quên mật khẩu</CardTitle>
            <CardDescription className="text-center">
              {step === 'verify' 
                ? 'Nhập tên đăng nhập và số điện thoại phụ huynh để lấy lại mật khẩu'
                : 'Nhập mã OTP đã được gửi đến số điện thoại phụ huynh'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="space-y-4 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
                <Alert>
                  <AlertDescription>
                    Chúng tôi đã gửi mật khẩu mới đến số điện thoại phụ huynh của bạn.
                    Vui lòng kiểm tra tin nhắn SMS.
                  </AlertDescription>
                </Alert>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setStep('verify')
                    setIsSubmitted(false)
                    form.reset()
                  }}
                >
                  Thử lại
                </Button>
              </div>
            ) : step === 'verify' ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên đăng nhập</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập tên đăng nhập của bạn"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parentPhone"
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                  >
                    {form.formState.isSubmitting ? (
                      "Đang xử lý..."
                    ) : (
                      "Tiếp tục"
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <Form {...form}>
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

                  <div className="flex flex-col space-y-2 mt-4">
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={otp.length !== 6}
                      className="w-full"
                    >
                      Xác nhận
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setStep('verify')}
                      className="w-full"
                    >
                      Quay lại
                    </Button>
                  </div>
                </Form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 