import prisma from "@/lib/db";

export const getTotalConnectedRepositories = async (userId: string) => {
  return await prisma.repository.count({
    where: {
      userId,
    },
  });
};

export const getTotalReviews = async (userId: string) => {
  return await prisma.review.count({
    where: {
      repository: {
        userId,
      },
    },
  });
};

export const getReviewsTrend = async (userId: string) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const reviews = await prisma.review.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
      repository: {
        userId,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const trend: { [key: string]: number } = {};

  // Initialize
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = monthNames[date.getMonth()];
    trend[monthKey] = 0;
  }

  // Aggregate
  reviews.forEach((review) => {
    const monthKey = monthNames[review.createdAt.getMonth()];
    if (trend.hasOwnProperty(monthKey)) {
      trend[monthKey] += 1;
    }
  });

  return Object.entries(trend).map(([month, reviews]) => ({
    month,
    reviews,
  }));
};
