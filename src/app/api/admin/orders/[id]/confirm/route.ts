import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAdminAuthenticated(request)
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const order = await prisma.order.update({
      where: { id },
      data: {
        deliveryConfirmed: true,
        deliveryConfirmedAt: new Date(),
      },
      include: { items: true },
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Confirm delivery error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to confirm delivery' },
      { status: 500 }
    )
  }
}
