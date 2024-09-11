import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = () => {
  const handleLoginSuccess = (response) => {
    console.log(response);
    // Xử lý đăng nhập thành công: Lấy mã token và gửi về server để xác thực
  };

  const handleLoginFailure = (error) => {
    console.error(error);
    // Xử lý lỗi đăng nhập
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onFailure={handleLoginFailure}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
