import { NextResponse } from 'next/server';
import { getPortfolioData, updatePortfolioData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authToken = request.cookies.get('admin_auth_token');
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.MOCK_API_URL) {
      return NextResponse.json(
        { error: 'MOCK_API_URL is not configured. Database saves are disabled.' },
        { status: 400 }
      );
    }
    const body = await request.json();
    await updatePortfolioData(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
