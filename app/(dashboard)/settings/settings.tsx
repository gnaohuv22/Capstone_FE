'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Moon, Sun, Volume2 } from 'lucide-react'

export function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [fontSize, setFontSize] = useState('medium');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cài đặt</h1>
        <p className="text-muted-foreground">
          Tùy chỉnh giao diện và trải nghiệm người dùng
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Giao diện */}
        <Card>
          <CardHeader>
            <CardTitle>Giao diện</CardTitle>
            <CardDescription>
              Tùy chỉnh giao diện người dùng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <Label htmlFor="dark-mode">Chế độ tối</Label>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>

            <div className="space-y-2">
              <Label>Cỡ chữ</Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cỡ chữ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Nhỏ</SelectItem>
                  <SelectItem value="medium">Vừa</SelectItem>
                  <SelectItem value="large">Lớn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Thông báo */}
        <Card>
          <CardHeader>
            <CardTitle>Thông báo</CardTitle>
            <CardDescription>
              Quản lý thông báo và âm thanh
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <Label htmlFor="notifications">Thông báo</Label>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <Label htmlFor="sound">Âm thanh</Label>
              </div>
              <Switch
                id="sound"
                checked={sound}
                onCheckedChange={setSound}
              />
            </div>
          </CardContent>
        </Card>

        {/* Xóa tài khoản */}
        <Card>
          <CardHeader>
            <CardTitle>Xóa tài khoản</CardTitle>
            <CardDescription>
              Xóa vĩnh viễn tài khoản và dữ liệu của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">
              Xóa tài khoản
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Lưu ý: Hành động này không thể hoàn tác
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 