import {
	BookOpen,
	Coins,
	Package,
	Smartphone,
	Store,
	Shirt,
	Wrench,
	Undo2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'guide' -> t('nav.guide')
	path: string // URL 路径，如 '/guide'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// SELL YOUR AVATAR 内容导航分类（与 keywords.json 的 categories 一一对应）
// 8 个分类：guide / robux / items / mobile / marketplace / clothing / troubleshooting / refunds
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'robux', path: '/robux', icon: Coins, isContentType: true },
	{ key: 'items', path: '/items', icon: Package, isContentType: true },
	{ key: 'mobile', path: '/mobile', icon: Smartphone, isContentType: true },
	{ key: 'marketplace', path: '/marketplace', icon: Store, isContentType: true },
	{ key: 'clothing', path: '/clothing', icon: Shirt, isContentType: true },
	{ key: 'troubleshooting', path: '/troubleshooting', icon: Wrench, isContentType: true },
	{ key: 'refunds', path: '/refunds', icon: Undo2, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['guide', 'robux', ...]

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
