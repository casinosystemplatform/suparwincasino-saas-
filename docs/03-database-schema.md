# 🗄️ Database Schema

## User
{
  email: string,
  password: string,
  balance: number,
  role: "user" | "admin"
}

## GameHistory
{
  userId,
  gameType,
  bet,
  result,
  createdAt
}
