import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, selectLoading, selectError } from "../../store/slices/authSlice";
import { Link } from 'react-router-dom';

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
  companyName: yup.string().required("Company Name is required"),
  companyRegistrationNumber: yup.string().required("Registration Number is required"),
  agree: yup.boolean().oneOf([true], "You must agree to continue"),
});

export default function RegisterForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {

      const resultAction = await dispatch(registerUser(data));
      
      if (registerUser.fulfilled.match(resultAction)) {
        navigate("/login");
      } else {
        console.error("Registration failed:", resultAction.payload);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">

        {/* Show error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Social buttons */}
        {/* <button 
          type="button" 
          className="w-full border border-gray-300 rounded-xl p-3.5 flex items-center justify-center gap-3 hover:bg-gray-50 transition font-medium text-gray-700"
        >
          <span className="text-xl font-bold text-[#EA4335]">G</span>
          <span>Continue with Google</span>
        </button>

        <button 
          type="button" 
          className="w-full bg-[#1877F2] text-white rounded-xl p-3.5 flex items-center justify-center gap-3 hover:bg-[#166FE5] transition font-medium"
        >
          <span className="text-xl font-bold">f</span>
          <span>Continue with Facebook</span>
        </button> */}

        {/* Divider */}
        {/* <div className="relative text-center my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or register with email</span>
          </div>
        </div> */}

        {/* Name fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input 
              {...register("firstName")}
              autoComplete="given-name"
              placeholder="First Name"
              className="p-3.5 border border-gray-300 rounded-xl w-full text-sm bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition" 
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName?.message}</p>
            )}
          </div>

          <div>
            <input {...register("role")} type="hidden" value="AGENCY_STAFF" />
            <input 
              {...register("lastName")}
              autoComplete="family-name"
              placeholder="Last Name"
              className="p-3.5 border border-gray-300 rounded-xl w-full text-sm bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition" 
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName?.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <input 
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@travelagency.com"
            className="w-full p-3.5 border border-gray-300 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition" 
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"}
            {...register("password")}
            autoComplete="new-password"
            placeholder="Create a strong password"
            className="w-full p-3.5 pr-12 border border-gray-300 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition" 
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>
        )}

        {/* Company details */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input 
              {...register("companyName")}
              autoComplete="organization"
              placeholder="Your Travel Agency"
              className="p-3.5 border border-gray-300 rounded-xl text-sm w-full bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition" 
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">{errors.companyName?.message}</p>
            )}
          </div>

          <div>
            <input 
              {...register("companyRegistrationNumber")}
              autoComplete="off"
              placeholder="REG-123456"
              className="p-3.5 border border-gray-300 rounded-xl text-sm w-full bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition" 
            />
            {errors.companyRegistrationNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.companyRegistrationNumber?.message}</p>
            )}
          </div>
        </div>

        {/* Agency type */}
        <select 
          {...register("agencyType")}
          className="p-3.5 border border-gray-300 rounded-xl text-sm w-full bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition text-gray-600"
        >
          <option value="">Agency Type (Optional)</option>
          <option value="inbound">Inbound</option>
          <option value="outbound">Outbound</option>
          <option value="corporate">Corporate</option>
        </select>

        {/* Terms checkbox */}
        <label className="text-sm flex gap-2 items-start cursor-pointer">
          <input 
            type="checkbox" 
            {...register("agree")} 
            className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          /> 
          <span className="text-gray-600">
            I agree to the <a href="#" className="text-blue-600 hover:underline font-medium">Terms</a> & <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>
          </span>
        </label>
        {errors.agree && (
          <p className="text-red-500 text-xs">{errors.agree?.message}</p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Complete Registration"}
        </button>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </form>
  );
}