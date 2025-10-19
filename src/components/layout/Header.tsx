'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Scale, User, LogOut, Settings, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({ title = "Sistema APEOC", subtitle }: HeaderProps) {
  const { user, logout } = useAuth()

  const getUserInitials = (name?: string, username?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return username?.slice(0, 2).toUpperCase() || 'U'
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'manager':
        return 'Gerente'
      default:
        return 'Usuário'
    }
  }

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Informações do Usuário */}
          <div className="flex items-center space-x-4">
            <Card className="px-4 py-2">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || user?.username}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getRoleBadge(user?.role || '')}`}>
                        {getRoleText(user?.role || '')}
                      </span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-600 text-white text-sm">
                            {getUserInitials(user?.name, user?.username)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user?.name || user?.username}</p>
                          {user?.email && (
                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configurações</span>
                      </DropdownMenuItem>
                      {user?.role === 'admin' && (
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Administração</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}