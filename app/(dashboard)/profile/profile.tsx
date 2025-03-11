'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { InfoIcon, Moon, Sun, Bell } from 'lucide-react'
import { useTheme } from "next-themes"

// Schema cho thông tin cá nhân
const profileFormSchema = z.object({
  username: z.string()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(50, 'Tên đăng nhập không được vượt quá 50 ký tự'),
  fullName: z.string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ tên không được vượt quá 50 ký tự'),
  phone: z.string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  address: z.string()
    .min(5, 'Địa chỉ phải có ít nhất 5 ký tự')
    .max(200, 'Địa chỉ không được vượt quá 200 ký tự'),
  dateOfBirth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày sinh không hợp lệ')
})

// Schema cho đổi mật khẩu
const passwordFormSchema = z.object({
  currentPassword: z.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  newPassword: z.string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
})

// Mock data cho user
const mockUser = {
  username: 'nguyenvana',
  fullName: 'Nguyễn Văn A',
  phone: '0987654321',
  address: 'Số 123, Đường ABC, Quận XYZ, TP.HCM',
  dateOfBirth: '1990-01-01',
  avatar: '/avatars/default.png'
}

export function Profile() {
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(theme === 'dark');
  const [notifications, setNotifications] = useState(true);

  // Đồng bộ trạng thái darkMode với theme
  useEffect(() => {
    setDarkMode(theme === 'dark');
  }, [theme]);

  // Cập nhật theme khi thay đổi darkMode
  useEffect(() => {
    setTheme(darkMode ? 'dark' : 'light');
  }, [darkMode, setTheme]);

  // Form cho thông tin cá nhân
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: mockUser
  })

  // Form cho đổi mật khẩu
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  // Xử lý cập nhật thông tin cá nhân
  const onProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
    console.log(values)
    // TODO: Gọi API cập nhật thông tin
    setIsEditing(false)
  }

  // Xử lý đổi mật khẩu
  const onPasswordSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    console.log(values)
    // TODO: Gọi API đổi mật khẩu
    passwordForm.reset()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hồ sơ của tôi</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin cá nhân và tùy chỉnh tài khoản của bạn
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
          <TabsTrigger value="preferences">Tùy chỉnh</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin cá nhân của bạn
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Hủy' : 'Sửa thông tin'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên đăng nhập</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          <Alert>
                            <InfoIcon className="h-4 w-4" />
                            <AlertDescription>
                              Tên đăng nhập không thể thay đổi
                            </AlertDescription>
                          </Alert>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại phụ huynh</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" disabled={!isEditing} />
                        </FormControl>
                        <FormDescription>
                          <Alert>
                            <InfoIcon className="h-4 w-4" />
                            <AlertDescription>
                              Thay đổi số điện thoại yêu cầu xác minh qua SMS
                            </AlertDescription>
                          </Alert>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày sinh</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isEditing && (
                    <Button 
                      type="submit"
                      disabled={!profileForm.formState.isValid || !profileForm.formState.isDirty}
                    >
                      Lưu thay đổi
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
              <CardDescription>
                Thay đổi mật khẩu để bảo vệ tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu hiện tại</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu mới</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormDescription>
                          Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit"
                    disabled={!passwordForm.formState.isValid || !passwordForm.formState.isDirty}
                  >
                    Đổi mật khẩu
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Tùy chỉnh</CardTitle>
              <CardDescription>
                Điều chỉnh giao diện và thông báo theo ý thích của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Giao diện</h3>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="dark-mode" className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <span>Chế độ sáng</span>
                      <span>/</span>
                      <Moon className="h-4 w-4 text-blue-500" />
                      <span>Chế độ tối</span>
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      Bật chế độ tối để giảm mỏi mắt khi sử dụng vào ban đêm
                    </span>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Thông báo</h3>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="notifications" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Thông báo</span>
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      Nhận thông báo về bài tập, tin nhắn và cập nhật mới
                    </span>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 