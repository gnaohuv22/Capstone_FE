'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, User, Phone, Mail, KeyRound, Eye, EyeOff, UserCircle, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const relationshipOptions = [
  { value: 'Bố', label: 'Bố' },
  { value: 'Mẹ', label: 'Mẹ' },
  { value: 'Ông', label: 'Ông' },
  { value: 'Bà', label: 'Bà' },
  { value: 'Anh', label: 'Anh' },
  { value: 'Chị', label: 'Chị' },
  { value: 'Chú', label: 'Chú' },
  { value: 'Bác', label: 'Bác' },
  { value: 'Cô', label: 'Cô' },
  { value: 'Dì', label: 'Dì' }
];

const schoolSuggestions = [
  "THPT Chu Văn An - Hà Nội",
  "THPT Phan Đình Phùng - Hà Nội",
  "THPT Việt Đức - Hà Nội",
  "THPT Amsterdam - Hà Nội",
  "THPT Kim Liên - Hà Nội",
  "THPT Nguyễn Du - Hà Nội",
  "THPT Trần Phú - Hà Nội",
  "THPT Lê Quý Đôn - Hà Nội",
  "THPT Nguyễn Trãi - Hà Nội",
  "THPT Lê Hồng Phong - TP.HCM",
  "THPT Lê Quý Đôn - TP.HCM",
  "THPT Nguyễn Thị Minh Khai - TP.HCM",
  "THPT Trần Đại Nghĩa - TP.HCM",
  "THPT Bùi Thị Xuân - TP.HCM"
];

const passwordRequirements = [
  { id: 'length', label: 'Ít nhất 8 ký tự', regex: /.{8,}/ },
  { id: 'lowercase', label: 'Ít nhất 1 chữ thường', regex: /[a-z]/ },
  { id: 'uppercase', label: 'Ít nhất 1 chữ hoa', regex: /[A-Z]/ },
  { id: 'number', label: 'Ít nhất 1 số', regex: /\d/ },
  { id: 'special', label: 'Ít nhất 1 ký tự đặc biệt', regex: /[@$!%*?&]/ }
];

const RequiredField = () => (
  <span className="text-red-500 ml-1">*</span>
);

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [schoolResults, setSchoolResults] = useState<string[]>([]);
  const [showSchoolSuggestions, setShowSchoolSuggestions] = useState(false);
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

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      relationship: value
    }));
    validateField('relationship', value);
  };

  const handleSchoolInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      school: value
    }));

    // Tìm kiếm trường học phù hợp
    if (value.length > 0) {
      const filteredSchools = schoolSuggestions.filter(school =>
        school.toLowerCase().includes(value.toLowerCase())
      );
      setSchoolResults(filteredSchools);
      setShowSchoolSuggestions(true);
    } else {
      setSchoolResults([]);
      setShowSchoolSuggestions(false);
    }

    validateField('school', value);
  };

  const handleSchoolSelect = (school: string) => {
    setFormData(prev => ({
      ...prev,
      school
    }));
    setShowSchoolSuggestions(false);
    validateField('school', school);
  };

  const getPasswordStrength = (password: string): number => {
    if (!password) return 0;
    let strength = 0;
    passwordRequirements.forEach(req => {
      if (req.regex.test(password)) strength++;
    });
    return (strength / passwordRequirements.length) * 100;
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
          
          // Kiểm tra định dạng ngày tháng
          if (isNaN(birthDate.getTime())) {
            newError[name] = 'Ngày sinh không hợp lệ';
            break;
          }

          // Kiểm tra ngày sinh không được trong tương lai
          if (birthDate > today) {
            newError[name] = 'Ngày sinh không thể là ngày trong tương lai';
            break;
          }

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
    <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-[400px_1fr] lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <GraduationCap className="mr-2 h-6 w-6" />
          Hệ thống học trực tuyến
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Giáo dục là vũ khí mạnh nhất mà bạn có thể sử dụng để thay đổi thế giới."
            </p>
            <footer className="text-sm">Nelson Mandela</footer>
          </blockquote>
        </div>
      </div>
      <div className="p-4 lg:p-8 h-full flex items-center">
        <Card className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Đăng ký tài khoản</CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin của bạn để tạo tài khoản mới
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Thông tin học sinh */}
              <div className="space-y-4">
                <h3 className="font-semibold">Thông tin học sinh</h3>
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Họ và tên<RequiredField />
                  </Label>
                  <div className="relative">
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={cn(
                        "pl-10",
                        errors.fullName && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  <AnimatePresence>
                    {errors.fullName && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.fullName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    Số điện thoại<RequiredField />
                  </Label>
                  <div className="relative">
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="0912345678"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={cn(
                        "pl-10",
                        errors.phoneNumber && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  <AnimatePresence>
                    {errors.phoneNumber && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.phoneNumber}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email<RequiredField />
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={cn(
                        "pl-10",
                        errors.email && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">
                      Mật khẩu<RequiredField />
                    </Label>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="space-y-2 p-4">
                          <h4 className="font-semibold">Yêu cầu mật khẩu:</h4>
                          <ul className="space-y-1">
                            {passwordRequirements.map((req) => (
                              <li key={req.id} className="flex items-center">
                                {req.regex.test(formData.password) ? (
                                  <Check className="h-4 w-4 text-green-500 mr-2" />
                                ) : (
                                  <div className="h-4 w-4 border border-gray-300 rounded-full mr-2" />
                                )}
                                {req.label}
                              </li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={cn(
                        "pl-10 pr-10",
                        errors.password && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-300",
                            getPasswordStrength(formData.password) <= 20
                              ? "bg-red-500"
                              : getPasswordStrength(formData.password) <= 40
                              ? "bg-orange-500"
                              : getPasswordStrength(formData.password) <= 60
                              ? "bg-yellow-500"
                              : getPasswordStrength(formData.password) <= 80
                              ? "bg-blue-500"
                              : "bg-green-500"
                          )}
                          style={{
                            width: `${getPasswordStrength(formData.password)}%`,
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Độ mạnh mật khẩu: {getPasswordStrength(formData.password)}%
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">
                    Ngày sinh<RequiredField />
                  </Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={cn(
                      errors.dateOfBirth && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">
                    Trường học<RequiredField />
                  </Label>
                  <div className="relative">
                    <Input
                      id="school"
                      name="school"
                      type="text"
                      placeholder="THPT Chu Văn An"
                      value={formData.school}
                      onChange={handleSchoolInputChange}
                      onFocus={() => setShowSchoolSuggestions(true)}
                      className={cn(
                        errors.school && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    {showSchoolSuggestions && schoolResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                        <ul className="py-1">
                          {schoolResults.map((school, index) => (
                            <li
                              key={index}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSchoolSelect(school)}
                            >
                              {school}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {errors.school && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.school}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">
                    Lớp<RequiredField />
                  </Label>
                  <Input
                    id="grade"
                    name="grade"
                    type="number"
                    min="1"
                    max="12"
                    placeholder="10"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className={cn(
                      errors.grade && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.grade && (
                    <p className="text-sm text-red-500">{errors.grade}</p>
                  )}
                </div>
              </div>

              {/* Thông tin phụ huynh */}
              <div className="space-y-4">
                <h3 className="font-semibold">Thông tin phụ huynh</h3>
                <div className="space-y-2">
                  <Label htmlFor="parentName">
                    Họ và tên phụ huynh<RequiredField />
                  </Label>
                  <div className="relative">
                    <Input
                      id="parentName"
                      name="parentName"
                      type="text"
                      placeholder="Nguyễn Văn B"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      className={cn(
                        "pl-10",
                        errors.parentName && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  <AnimatePresence>
                    {errors.parentName && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.parentName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentPhone">
                    Số điện thoại phụ huynh<RequiredField />
                  </Label>
                  <div className="relative">
                    <Input
                      id="parentPhone"
                      name="parentPhone"
                      type="tel"
                      placeholder="0912345678"
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      className={cn(
                        "pl-10",
                        errors.parentPhone && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  <AnimatePresence>
                    {errors.parentPhone && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.parentPhone}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship">
                    Quan hệ với học sinh<RequiredField />
                  </Label>
                  <Select
                    value={formData.relationship}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger
                      className={cn(
                        errors.relationship && "border-red-500 focus-visible:ring-red-500"
                      )}
                    >
                      <SelectValue placeholder="Chọn mối quan hệ" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationshipOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <AnimatePresence>
                    {errors.relationship && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.relationship}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Email phụ huynh</Label>
                  <div className="relative">
                    <Input
                      id="parentEmail"
                      name="parentEmail"
                      type="email"
                      placeholder="parent@email.com"
                      value={formData.parentEmail}
                      onChange={handleInputChange}
                      className={cn(
                        "pl-10",
                        errors.parentEmail && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  <AnimatePresence>
                    {errors.parentEmail && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.parentEmail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || Object.values(errors).some(error => error !== '')}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý
                  </>
                ) : (
                  'Đăng ký'
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}