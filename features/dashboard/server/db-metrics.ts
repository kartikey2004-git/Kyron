import prisma from "@/server/db/client";

/*
 
  - Server actions for database queries for dashboard metrics that are specific to this application, such as connected repositories and AI reviews.
 
  - Unlike commits and pull requests, this data doesn't exist on GitHub and is retrieved directly from our database.

*/

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

// Group AI reviews by the last six calendar months, using month names as the key, so they can be merged directly with the monthly commit and PR data.

export const getReviewsTrend = async (userId: string) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Fetch all AI reviews created within the last six months for repositories owned by the user. The results are later grouped into monthly counts.

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

  // Initialize trend with the last six months

  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = monthNames[date.getMonth()];
    trend[monthKey] = 0;
  }

  // Aggregate AI generated reviews by month

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
