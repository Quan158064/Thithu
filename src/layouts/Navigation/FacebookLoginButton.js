// FacebookLoginButton.js
import React from 'react';
import FacebookLogin from '@greatsumini/react-facebook-login';

const FacebookLoginButton = () => {
  const handleResponse = (response) => {
    console.log(response);
    // Xử lý token và thông tin người dùng
  };

  const handleError = (error) => {
    console.error(error);
    // Xử lý lỗi
  };

  return (
    <FacebookLogin
      appId="YOUR_FACEBOOK_APP_ID"
      onSuccess={handleResponse}
      onFailure={handleError}
      fields="name,email,picture"
      scope="public_profile,email"
    />
  );
};

export default FacebookLoginButton;
