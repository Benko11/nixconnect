jest.mock("@supabase/@supabase-js", () => ({
  createClient: jest.fn(() => {
    from: jest.fn().mockReturnThis();
    insert: jest.fn().mockResolvedValue({ data: {}, error: null });
    select: jest.fn().mockResolvedValue({ data: [], error: null });
  }),
}));
