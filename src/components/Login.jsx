import React, { useState, useEffect } from 'react';
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { BeatLoader } from 'react-spinners';
import * as Yup from 'yup';
import Error from './Error';
import useFetch from '@/hooks/useFetch';
import { login } from '@/db/apiAuth'; // ✅ use login function here
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UrlState } from '@/Context';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const { data, error, loading, fn: loginFn } = useFetch(login, formData);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longlink = searchParams.get("createNew");
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (!loading && data && error === null) {
      fetchUser(); // ✅ set user in global state
      navigate(`/dashboard${longlink ? `?createNew=${longlink}` : ""}`);
    }
  }, [data, error, loading, longlink, navigate, fetchUser]);

  const handleLogin = async () => {
    setErrors({});
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
      });

      await schema.validate(formData, { abortEarly: false });
      await loginFn();
    } catch (e) {
      const newErrors = {};
      if (e?.inner) {
        e.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
      } else {
        newErrors.general = e.message;
      }
      setErrors(newErrors);
    }
  };

  return (
    <Card className="w-[400px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Log in to your account if you already have one.
        </CardDescription>
        {error && <Error message={error.message} />}
        {errors.general && <Error message={errors.general} />}
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email} />}
        </div>

        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <Error message={errors.password} />}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
