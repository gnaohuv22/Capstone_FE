'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, User, Phone, Mail, KeyRound, Eye, EyeOff, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    dateOfBirth: '',
    school: '',
    grade: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    relationship: ''
  });
  const [errors, setErrors] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    dateOfBirth: '',
    school: '',
    grade: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    relationship: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Xử lý đặc biệt cho số điện thoại
    if (name === 'phoneNumber' || name === 'parentPhone') {
      processedValue = value.replace(/[^0-9]/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Validation realtime
    validateField(name, processedValue);
  };

  // Validate từng trường riêng lẻ
  const validateField = (name: string, value: string) => {
    const newError = { [name]: '' };

    switch (name) {
      case 'fullName':
        if (!value) {
          newError[name] = 'Vui lòng nhập họ và tên';
        } else if (value.length < 2) {
          newError[name] = 'Họ tên phải có ít nhất 2 ký tự';
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
          newError[name] = 'Họ tên chỉ được chứa chữ cái và khoảng trắng';
        }
        break;

      case 'phoneNumber':
        if (!value) {
          newError[name] = 'Vui lòng nhập số điện thoại';
        } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(value)) {
          newError[name] = 'Số điện thoại không hợp lệ (VD: 0912345678)';
        }
        break;

      case 'email':
        if (!value) {
          newError[name] = 'Vui lòng nhập email';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          newError[name] = 'Email không hợp lệ';
        }
        break;

      case 'password':
        if (!value) {
          newError[name] = 'Vui lòng nhập mật khẩu';
        } else {
          if (value.length < 8) {
            newError[name] = 'Mật khẩu phải có ít nhất 8 ký tự';
          } else if (!/(?=.*[a-z])/.test(value)) {
            newError[name] = 'Mật khẩu phải chứa ít nhất 1 chữ thường';
          } else if (!/(?=.*[A-Z])/.test(value)) {
            newError[name] = 'Mật khẩu phải chứa ít nhất 1 chữ hoa';
          } else if (!/(?=.*\d)/.test(value)) {
            newError[name] = 'Mật khẩu phải chứa ít nhất 1 số';
          } else if (!/(?=.*[@$!%*?&])/.test(value)) {
            newError[name] = 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (@$!%*?&)';
          }
        }
        break;

      case 'dateOfBirth':
        if (!value) {
          newError[name] = 'Vui lòng chọn ngày sinh';
        } else {
          const birthDate = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }

          if (age < 6) {
            newError[name] = 'Học sinh phải từ 6 tuổi trở lên';
          } else if (age > 20) {
            newError[name] = 'Độ tuổi không hợp lệ cho học sinh';
          }
        }
        break;

      case 'school':
        if (!value) {
          newError[name] = 'Vui lòng nhập tên trường';
        } else if (value.length < 3) {
          newError[name] = 'Tên trường phải có ít nhất 3 ký tự';
        }
        break;

      case 'grade':
        if (!value) {
          newError[name] = 'Vui lòng nhập lớp';
        } else if (!/^([1-9]|1[0-2])$/.test(value)) {
          newError[name] = 'Lớp không hợp lệ (từ lớp 1 đến lớp 12)';
        }
        break;

      case 'parentName':
        if (!value) {
          newError[name] = 'Vui lòng nhập họ tên phụ huynh';
        } else if (value.length < 2) {
          newError[name] = 'Họ tên phụ huynh phải có ít nhất 2 ký tự';
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
          newError[name] = 'Họ tên phụ huynh chỉ được chứa chữ cái và khoảng trắng';
        }
        break;

      case 'parentPhone':
        if (!value) {
          newError[name] = 'Vui lòng nhập số điện thoại phụ huynh';
        } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(value)) {
          newError[name] = 'Số điện thoại không hợp lệ (VD: 0912345678)';
        } else if (value === formData.phoneNumber) {
          newError[name] = 'Số điện thoại phụ huynh không được trùng với số điện thoại học sinh';
        }
        break;

      case 'relationship':
        if (!value) {
          newError[name] = 'Vui lòng nhập quan hệ với học sinh';
        } else if (!['Bố', 'Mẹ', 'Ông', 'Bà', 'Anh', 'Chị', 'Chú', 'Bác', 'Cô', 'Dì'].includes(value)) {
          newError[name] = 'Quan hệ không hợp lệ (Bố, Mẹ, Ông, Bà, Anh, Chị, Chú, Bác, Cô, Dì)';
        }
        break;

      case 'parentEmail':
        if (value) {
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            newError[name] = 'Email không hợp lệ';
          } else if (value === formData.email) {
            newError[name] = 'Email phụ huynh không được trùng với email học sinh';
          }
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      ...newError
    }));

    return !newError[name]; // Trả về true nếu không có lỗi
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate tất cả các trường
    const isValid = Object.keys(formData).every(field => 
      validateField(field, formData[field as keyof typeof formData])
    );

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng kiểm tra lại thông tin đăng ký",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Đăng ký thành công",
        description: "Chào mừng bạn đến với hệ thống!",
      });
      
      // Redirect sau khi đăng ký thành công
      // router.push('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Đăng ký thất bại",
        description: "Có lỗi xảy ra, vui lòng thử lại sau",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/20 to-background p-4">
      <Card className="w-full max-w-2xl my-8">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
          <CardDescription>
            Điền thông tin để tạo tài khoản mới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Thông tin học sinh */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin học sinh
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Nhập họ và tên"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={cn(errors.fullName && "border-red-500")}
                    disabled={isLoading}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={cn(errors.dateOfBirth && "border-red-500")}
                    disabled={isLoading}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school">Trường</Label>
                  <Input
                    id="school"
                    name="school"
                    placeholder="Nhập tên trường"
                    value={formData.school}
                    onChange={handleInputChange}
                    className={cn(errors.school && "border-red-500")}
                    disabled={isLoading}
                  />
                  {errors.school && (
                    <p className="text-sm text-red-500">{errors.school}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Lớp</Label>
                  <Input
                    id="grade"
                    name="grade"
                    placeholder="Nhập lớp"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className={cn(errors.grade && "border-red-500")}
                    disabled={isLoading}
                  />
                  {errors.grade && (
                    <p className="text-sm text-red-500">{errors.grade}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      className={cn(
                        "pl-9",
                        errors.phoneNumber && "border-red-500"
                      )}
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      maxLength={10}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Nhập email"
                      className={cn(
                        "pl-9",
                        errors.email && "border-red-500"
                      )}
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu"
                      className={cn(
                        "pl-9 pr-9",
                        errors.password && "border-red-500"
                      )}
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10 px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Thông tin phụ huynh */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Thông tin phụ huynh
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Họ và tên phụ huynh</Label>
                  <Input
                    id="parentName"
                    name="parentName"
                    placeholder="Nhập họ và tên phụ huynh"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    className={cn(errors.parentName && "border-red-500")}
                    disabled={isLoading}
                  />
                  {errors.parentName && (
                    <p className="text-sm text-red-500">{errors.parentName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Quan hệ với học sinh</Label>
                  <Input
                    id="relationship"
                    name="relationship"
                    placeholder="VD: Bố, Mẹ, ..."
                    value={formData.relationship}
                    onChange={handleInputChange}
                    className={cn(errors.relationship && "border-red-500")}
                    disabled={isLoading}
                  />
                  {errors.relationship && (
                    <p className="text-sm text-red-500">{errors.relationship}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Số điện thoại phụ huynh</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="parentPhone"
                      name="parentPhone"
                      type="tel"
                      placeholder="Nhập số điện thoại phụ huynh"
                      className={cn(
                        "pl-9",
                        errors.parentPhone && "border-red-500"
                      )}
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      maxLength={10}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.parentPhone && (
                    <p className="text-sm text-red-500">{errors.parentPhone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Email phụ huynh</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="parentEmail"
                      name="parentEmail"
                      type="email"
                      placeholder="Nhập email phụ huynh"
                      className={cn(
                        "pl-9",
                        errors.parentEmail && "border-red-500"
                      )}
                      value={formData.parentEmail}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.parentEmail && (
                    <p className="text-sm text-red-500">{errors.parentEmail}</p>
                  )}
                </div>
              </div>
            </div>

            <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                'Đăng ký'
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Đã có tài khoản?{' '}
              <Link 
                href="/login" 
                className={cn(
                  "text-primary hover:underline",
                  isLoading && "pointer-events-none opacity-50"
                )}
              >
                Đăng nhập
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}