const mockUser = {
  uid: "test-uid",
  username: "username",
  display_name: "名無しの権兵衛",
};

describe("画像CRUD API", () => {
  it("アップロード", async () => {
    // await listImages();
    // await uploadImage(mockUser);
    // await deleteImage(mockUser.uid);
  });
});

const listSuccess = {
  resources: [
    {
      asset_id: "78ab3f2f5c5099643aa8f9108fb268d1",
      public_id: "avatar/36bcce1e-fa53-43f7-b903-a417f8d9fab0",
      format: "jpg",
      version: 1751816359,
      resource_type: "image",
      type: "upload",
      created_at: "2025-07-06T15:39:19Z",
      bytes: 2998,
      width: 192,
      height: 108,
      asset_folder: "avatar",
      display_name: "36bcce1e-fa53-43f7-b903-a417f8d9fab0",
      access_control: [{ access_type: "anonymous" }],
      url: "http://res.cloudinary.com/dgsdrcpcs/image/upload/v1751816359/avatar/36bcce1e-fa53-43f7-b903-a417f8d9fab0.jpg",
      secure_url:
        "https://res.cloudinary.com/dgsdrcpcs/image/upload/v1751816359/avatar/36bcce1e-fa53-43f7-b903-a417f8d9fab0.jpg",
    },
  ],
  rate_limit_allowed: 500,
  rate_limit_reset_at: "2025-07-28T06:00:00.000Z",
  rate_limit_remaining: 491,
};

const uploadFailed = {
  error: {
    stack: "Error: ENOENT: no such file or directory, open 'dog.mp4'",
    message: "ENOENT: no such file or directory, open 'dog.mp4'",
    errno: -2,
    code: "ENOENT",
    syscall: "open",
    path: "dog.mp4",
    constructor: "Function<Error>",
    name: "Error",
    toString: "Function<toString>",
  },
  stacks: [],
};

const uploadSuccess = {
  asset_id: "8a515ef9b6ec445fb68041723f8ff1c6",
  public_id: "avatar/test-uid",
  version: 1753686036,
  version_id: "705a6e856da24ebab345828c4b5b39a7",
  signature: "8e4c759df2758fea555a8b3d52ce28dcb03f50bd",
  width: 100,
  height: 100,
  format: "svg",
  resource_type: "image",
  created_at: "2025-07-28T07:00:36Z",
  tags: [],
  bytes: 1181,
  type: "upload",
  etag: "1f75f3c4900ee2299abc82eb6e0ea604",
  placeholder: false,
  url: "http://res.cloudinary.com/dgsdrcpcs/image/upload/v1753686036/avatar/test-uid.svg",
  secure_url:
    "https://res.cloudinary.com/dgsdrcpcs/image/upload/v1753686036/avatar/test-uid.svg",
  asset_folder: "avatar",
  display_name: "名無しの権兵衛",
  overwritten: true,
  original_filename: "favicon",
  api_key: "692928434341139",
};

const deleteSuccess = { result: "ok" };
const deleteFailed = { result: "not found" };
