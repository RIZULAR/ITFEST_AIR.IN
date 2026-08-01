<template>
  <button
    :class="cn(buttonVariants({ variant, size }), $attrs.class as string)"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-700/20',
        secondary: 'bg-sky-600 text-white hover:bg-sky-700 border border-sky-700/20',
        outline: 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
        ghost: 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700 border border-red-700/20',
        agri: 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-700/20',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-xl px-6 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type ButtonVariants = VariantProps<typeof buttonVariants>

interface Props {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  disabled?: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
  loading: false,
})
</script>
