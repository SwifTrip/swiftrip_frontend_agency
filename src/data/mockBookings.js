/**
 * Mock Booking Data
 * This file contains static mock data for development
 * Easy to replace with real API data later
 */

import {
  BOOKING_STATUS,
  TOUR_TYPE,
  PAYMENT_STATUS,
} from "../utils/bookingConstants";

export const mockBookings = [
  {
    id: "BK-2026-001",
    bookingDate: "2026-02-20T10:30:00Z",
    tourType: TOUR_TYPE.PUBLIC,
    status: BOOKING_STATUS.ONGOING,
    paymentStatus: PAYMENT_STATUS.PAID,
    package: {
      id: "PKG-001",
      title: "Northern Areas Adventure",
      destination: "Hunza Valley, Gilgit",
      duration: "7 Days / 6 Nights",
      category: "ADVENTURE",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    },
    schedule: {
      id: "SCH-001",
      startDate: "2026-02-18",
      endDate: "2026-02-24",
      currentDay: 3,
    },
    tourist: {
      id: "USR-001",
      name: "Ahmed Khan",
      email: "ahmed.khan@email.com",
      phone: "+92 300 1234567",
      avatar: null,
      cnic: "35201-1234567-1",
    },
    pricing: {
      basePrice: 45000,
      discount: 5000,
      tax: 4000,
      totalAmount: 44000,
      paidAmount: 44000,
      currency: "PKR",
    },
    participants: 2,
    notes: "Vegetarian meals requested",
    createdAt: "2026-02-15T09:00:00Z",
    updatedAt: "2026-02-20T10:30:00Z",
  },
  {
    id: "BK-2026-002",
    bookingDate: "2026-02-19T14:20:00Z",
    tourType: TOUR_TYPE.PRIVATE,
    status: BOOKING_STATUS.CONFIRMED,
    paymentStatus: PAYMENT_STATUS.PARTIAL,
    package: {
      id: "PKG-002",
      title: "Skardu Explorer - Private",
      destination: "Skardu, Shangrila",
      duration: "5 Days / 4 Nights",
      category: "LUXURY",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",
    },
    schedule: {
      id: "SCH-002",
      startDate: "2026-03-01",
      endDate: "2026-03-05",
      currentDay: 0,
    },
    tourist: {
      id: "USR-002",
      name: "Sarah Williams",
      email: "sarah.w@email.com",
      phone: "+92 321 9876543",
      avatar: null,
      cnic: "42101-7654321-2",
    },
    pricing: {
      basePrice: 120000,
      discount: 0,
      tax: 12000,
      totalAmount: 132000,
      paidAmount: 66000,
      currency: "PKR",
    },
    participants: 4,
    notes: "Family trip with 2 children",
    createdAt: "2026-02-19T14:20:00Z",
    updatedAt: "2026-02-19T14:20:00Z",
  },
  {
    id: "BK-2026-003",
    bookingDate: "2026-02-10T08:00:00Z",
    tourType: TOUR_TYPE.PUBLIC,
    status: BOOKING_STATUS.COMPLETED,
    paymentStatus: PAYMENT_STATUS.PAID,
    package: {
      id: "PKG-003",
      title: "Lahore Heritage Walk",
      destination: "Lahore",
      duration: "1 Day",
      category: "CULTURAL",
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop",
    },
    schedule: {
      id: "SCH-003",
      startDate: "2026-02-12",
      endDate: "2026-02-12",
      currentDay: 1,
    },
    tourist: {
      id: "USR-003",
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "+92 333 5551234",
      avatar: null,
      cnic: "35202-1111222-3",
    },
    pricing: {
      basePrice: 8000,
      discount: 0,
      tax: 800,
      totalAmount: 8800,
      paidAmount: 8800,
      currency: "PKR",
    },
    participants: 1,
    notes: "",
    createdAt: "2026-02-08T16:00:00Z",
    updatedAt: "2026-02-12T18:00:00Z",
  },
  {
    id: "BK-2026-004",
    bookingDate: "2026-02-22T11:45:00Z",
    tourType: TOUR_TYPE.PUBLIC,
    status: BOOKING_STATUS.PENDING,
    paymentStatus: PAYMENT_STATUS.PENDING,
    package: {
      id: "PKG-004",
      title: "Swat Valley Tour",
      destination: "Swat, Malam Jabba",
      duration: "4 Days / 3 Nights",
      category: "ADVENTURE",
      image:
        "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=400&h=300&fit=crop",
    },
    schedule: {
      id: "SCH-004",
      startDate: "2026-03-10",
      endDate: "2026-03-13",
      currentDay: 0,
    },
    tourist: {
      id: "USR-004",
      name: "Fatima Ali",
      email: "fatima.ali@email.com",
      phone: "+92 345 6789012",
      avatar: null,
      cnic: "17301-9876543-4",
    },
    pricing: {
      basePrice: 35000,
      discount: 3500,
      tax: 3150,
      totalAmount: 34650,
      paidAmount: 0,
      currency: "PKR",
    },
    participants: 3,
    notes: "Requires pickup from Islamabad Airport",
    createdAt: "2026-02-22T11:45:00Z",
    updatedAt: "2026-02-22T11:45:00Z",
  },
  {
    id: "BK-2026-005",
    bookingDate: "2026-02-05T09:30:00Z",
    tourType: TOUR_TYPE.PRIVATE,
    status: BOOKING_STATUS.CANCELLED,
    paymentStatus: PAYMENT_STATUS.REFUNDED,
    package: {
      id: "PKG-005",
      title: "Fairy Meadows Expedition",
      destination: "Fairy Meadows, Nanga Parbat",
      duration: "6 Days / 5 Nights",
      category: "TREKKING",
      image:
        "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop",
    },
    schedule: {
      id: "SCH-005",
      startDate: "2026-02-20",
      endDate: "2026-02-25",
      currentDay: 0,
    },
    tourist: {
      id: "USR-005",
      name: "John Smith",
      email: "j.smith@email.com",
      phone: "+92 311 2223333",
      avatar: null,
      cnic: "61101-5554443-5",
    },
    pricing: {
      basePrice: 95000,
      discount: 0,
      tax: 9500,
      totalAmount: 104500,
      paidAmount: 0,
      currency: "PKR",
    },
    participants: 2,
    notes: "Cancelled due to weather conditions",
    createdAt: "2026-02-05T09:30:00Z",
    updatedAt: "2026-02-18T14:00:00Z",
  },
  {
    id: "BK-2026-006",
    bookingDate: "2026-02-21T16:00:00Z",
    tourType: TOUR_TYPE.PUBLIC,
    status: BOOKING_STATUS.CONFIRMED,
    paymentStatus: PAYMENT_STATUS.PAID,
    package: {
      id: "PKG-006",
      title: "Neelum Valley Escape",
      destination: "Neelum Valley, Sharda",
      duration: "3 Days / 2 Nights",
      category: "NATURE",
      image:
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=300&fit=crop",
    },
    schedule: {
      id: "SCH-006",
      startDate: "2026-02-28",
      endDate: "2026-03-02",
      currentDay: 0,
    },
    tourist: {
      id: "USR-006",
      name: "Zainab Malik",
      email: "zainab.m@email.com",
      phone: "+92 302 4445556",
      avatar: null,
      cnic: "37405-2223334-6",
    },
    pricing: {
      basePrice: 28000,
      discount: 2800,
      tax: 2520,
      totalAmount: 27720,
      paidAmount: 27720,
      currency: "PKR",
    },
    participants: 2,
    notes: "Honeymoon trip",
    createdAt: "2026-02-21T16:00:00Z",
    updatedAt: "2026-02-21T16:00:00Z",
  },
  {
    id: "BK-2026-007",
    bookingDate: "2026-02-23T08:15:00Z",
    tourType: TOUR_TYPE.PRIVATE,
    status: BOOKING_STATUS.ONGOING,
    paymentStatus: PAYMENT_STATUS.PAID,
    package: {
      id: "PKG-007",
      title: "Corporate Retreat - Murree",
      destination: "Murree, Nathia Gali",
      duration: "2 Days / 1 Night",
      category: "CORPORATE",
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop",
    },
    schedule: {
      id: "SCH-007",
      startDate: "2026-02-23",
      endDate: "2026-02-24",
      currentDay: 1,
    },
    tourist: {
      id: "USR-007",
      name: "Usman Ghani",
      email: "u.ghani@company.com",
      phone: "+92 300 7778889",
      avatar: null,
      cnic: "35201-6667778-7",
    },
    pricing: {
      basePrice: 180000,
      discount: 18000,
      tax: 16200,
      totalAmount: 178200,
      paidAmount: 178200,
      currency: "PKR",
    },
    participants: 15,
    notes: "Team building activities required",
    createdAt: "2026-02-20T10:00:00Z",
    updatedAt: "2026-02-23T08:15:00Z",
  },
  {
    id: "BK-2026-008",
    bookingDate: "2026-02-18T12:30:00Z",
    tourType: TOUR_TYPE.PUBLIC,
    status: BOOKING_STATUS.COMPLETED,
    paymentStatus: PAYMENT_STATUS.PAID,
    package: {
      id: "PKG-008",
      title: "Karachi City Tour",
      destination: "Karachi",
      duration: "1 Day",
      category: "CULTURAL",
      image:
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop",
    },
    schedule: {
      id: "SCH-008",
      startDate: "2026-02-19",
      endDate: "2026-02-19",
      currentDay: 1,
    },
    tourist: {
      id: "USR-008",
      name: "Ali Raza",
      email: "ali.raza@email.com",
      phone: "+92 312 1112223",
      avatar: null,
      cnic: "42201-3334445-8",
    },
    pricing: {
      basePrice: 5000,
      discount: 500,
      tax: 450,
      totalAmount: 4950,
      paidAmount: 4950,
      currency: "PKR",
    },
    participants: 1,
    notes: "",
    createdAt: "2026-02-18T12:30:00Z",
    updatedAt: "2026-02-19T19:00:00Z",
  },
];

// Calculate statistics from mock data
export const calculateBookingStats = (bookings) => {
  return {
    total: bookings.length,
    ongoing: bookings.filter((b) => b.status === BOOKING_STATUS.ONGOING).length,
    completed: bookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED)
      .length,
    pending: bookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length,
    confirmed: bookings.filter((b) => b.status === BOOKING_STATUS.CONFIRMED)
      .length,
    cancelled: bookings.filter((b) => b.status === BOOKING_STATUS.CANCELLED)
      .length,
    publicTours: bookings.filter((b) => b.tourType === TOUR_TYPE.PUBLIC).length,
    privateTours: bookings.filter((b) => b.tourType === TOUR_TYPE.PRIVATE)
      .length,
    totalRevenue: bookings
      .filter((b) => b.status !== BOOKING_STATUS.CANCELLED)
      .reduce((sum, b) => sum + b.pricing.paidAmount, 0),
    pendingPayments: bookings
      .filter(
        (b) =>
          b.paymentStatus === PAYMENT_STATUS.PENDING ||
          b.paymentStatus === PAYMENT_STATUS.PARTIAL,
      )
      .reduce(
        (sum, b) => sum + (b.pricing.totalAmount - b.pricing.paidAmount),
        0,
      ),
  };
};

export default mockBookings;
