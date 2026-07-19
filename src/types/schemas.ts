import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number(),
  sku: z.string(),
  title: z.string(),
  slug: z.string(),
  image: z.string(),
  category: z.enum([
    'tractor-structure',
    'truck-structure',
    'car-structure',
    'road-safety-rules',
    'first-aid'
  ]),
  status: z.enum(['published', 'draft']).default('published'),
  priceOverride: z.number().nullable().default(null),
  sizeOverride: z.object({
    widthMm: z.number(),
    heightMm: z.number()
  }).nullable().default(null),
  materialOverride: z.string().nullable().default(null),
  thicknessOverride: z.number().nullable().default(null),
  description: z.string().optional()
});

export type Product = z.infer<typeof ProductSchema>;

export const CartItemSchema = z.object({
  sku: z.string(),
  title: z.string(),
  price: z.number(),
  count: z.number().min(1),
  isCustom: z.boolean().default(false),
  customRequirements: z.string().nullable().default(null)
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const DeliverySchema = z.object({
  provider: z.literal("nova-poshta").default("nova-poshta"),
  type: z.enum(["branch", "parcel-locker"]),
  cityName: z.string().min(1, "Місто обов'язкове для заповнення"),
  cityRef: z.string().nullable().default(null),
  warehouseName: z.string().min(1, "Оберіть відділення або поштомат"),
  warehouseRef: z.string().nullable().default(null),
  recipientName: z.string().min(1, "Вкажіть ім'я отримувача"),
  recipientPhone: z.string().regex(/^\+?380\d{9}$/, "Некоректний формат телефону"),
  estimatedCost: z.number().nullable().default(null),
  trackingNumber: z.string().nullable().default(null)
});

export type Delivery = z.infer<typeof DeliverySchema>;

export const VatInvoiceRequestSchema = z.object({
  companyName: z.string().min(1, "Назва компанії або ФОП є обов'язковою"),
  taxId: z.string().regex(/^\d{8,10}$/, "Код ЄДРПОУ має містити 8 цифр, а РНОКПП — 10"),
  legalAddress: z.string().min(1, "Юридична адреса обов'язкова"),
  invoiceEmail: z.string().email("Некоректна адреса електронної пошти"),
  contactName: z.string().min(1, "Вкажіть контактну особу"),
  contactPhone: z.string().regex(/^\+?380\d{9}$/, "Некоректний формат телефону"),
  comment: z.string().optional()
});

export type VatInvoiceRequest = z.infer<typeof VatInvoiceRequestSchema>;

export const PaymentMethodSchema = z.enum(["card", "invoiceWithVat", "manualConfirmation"]);
export const PaymentStatusSchema = z.enum(["pending", "awaitingPayment", "paid", "failed", "cancelled"]);

export const PaymentSchema = z.object({
  paymentMethod: PaymentMethodSchema,
  paymentStatus: PaymentStatusSchema,
  paymentProvider: z.string().nullable().default(null),
  paymentReference: z.string().nullable().default(null)
});

export type Payment = z.infer<typeof PaymentSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  clientName: z.string().min(1, "Вкажіть ваше ім'я"),
  clientPhone: z.string().regex(/^\+?380\d{9}$/, "Некоректний формат телефону"),
  clientEmail: z.string().email("Некоректний email"),
  items: z.array(CartItemSchema).min(1, "Кошик порожній"),
  totalCost: z.number(),
  hasCustomItems: z.boolean(),
  delivery: DeliverySchema,
  payment: PaymentSchema,
  vatRequest: VatInvoiceRequestSchema.nullable().default(null),
  comment: z.string().optional(),
  userAgreement: z.boolean().refine(val => val === true, "Потрібна згода на обробку даних")
});

export type Order = z.infer<typeof OrderSchema>;
