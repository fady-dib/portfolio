import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

const ContactForm = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [isSubmitted, setIsSubmitted] = useState(false); 
    const [error, setError] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState("");


    const { executeRecaptcha } = useGoogleReCaptcha();

    useEffect(() => {
        if (!executeRecaptcha) return;

        executeRecaptcha("submit").then((token) => {
            setRecaptchaToken(token);
        });
    }, [executeRecaptcha]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!recaptchaToken) {
            alert("reCAPTCHA verification failed. Please refresh the page and try again.");
            return;
        }

        setError(false); 
        setIsSubmitting(true);

        const dataToSend = {
            ...formData,
            "g-recaptcha-response": recaptchaToken, 
        };

        emailjs
            .send(
                "service_btg0hmp", 
                "template_x8vxheh",
                dataToSend,
                "q9y9LUIeO6VI4BSo3" 
            )
            .then(
                (response) => {
                    console.log("SUCCESS!", response.status, response.text);
                    setIsSubmitted(true); // Show success message
                    setFormData({ name: "", email: "", message: "" }); // Clear the form
                    setIsSubmitting(false); // Hide spinner
                },
                (error) => {
                    console.error("FAILED...", error);
                    setError(true);
                    setIsSubmitting(false);
                }
            );
    };

  return (
    <>
          <div className='flex justify-center items-center pt-16 container mx-auto px-5'>
              <div className="w-full max-w-3xl bg-white md:p-10 p-5 rounded-lg shadow-lg border border-[#204958]">
                  {isSubmitted && (
                      <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl shadow-lg text-center max-w-md mx-auto transform scale-95 transition-all duration-500 ease-in-out mb-10 animate-fade-in">
                          <p className="font-semibold text-lg">Form submitted successfully!</p>
                      </div>
                  )}
                  {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-lg text-center max-w-md mx-auto transform scale-95 transition-all duration-500 ease-in-out mb-10 animate-fade-in">
                          <p className="font-semibold text-lg">Error happened while submitting the form</p>
                      </div>
                  )}
                  <form onSubmit={handleSubmit}>
                      {/* Name Field */}
                    <div className="mb-6">
                          <label htmlFor="name" className="block text-[#1F4959] inter-bold mb-2">
                              Name
                          </label>
                          <input
                              type="text"
                              id="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter Your Name"
                              className="w-full px-4 py-4 bg-gray-100 text-[#1F4959] border outline-none border-none rounded-md "
                              required
                          />
                      </div>

                      {/* Email Field */}
                    <div className="mb-6">
                          <label htmlFor="email" className="block text-[#1F4959] inter-bold mb-2">
                              Email
                          </label>
                          <input
                              type="email"
                              id="email"
                              placeholder="Enter Your Email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full px-4 py-4 bg-gray-100 text-[#1F4959] border rounded-md outline-none border-none"
                              required
                          />
                      </div>

                      {/* Message Field */}
                      <div className="mb-6">
                          <label htmlFor="message" className="block  text-[#1F4959] inter-bold mb-2">
                              Message
                          </label>
                          <textarea
                              id="message"
                              placeholder="Enter Your Message"
                              rows="10"
                              value={formData.message}
                              onChange={handleChange}
                              className="w-full px-4 py-4 bg-gray-100 text-[#1F4959] border rounded-md outline-none border-none overflow-y-auto resize-none"
                              required
                          ></textarea>
                      </div>

                      {/* Submit Button */}
                      <div className="text-right">
                        <button
                            type="submit"
                            disabled={isSubmitting} 
                            style={{ marginLeft: "auto" }}
                              className="w-full md:w-[200px] py-4 bg-[#1F4959] text-white focus:outline-none duration-700 hover:bg-[#1A3641] hover:font-bold hover:text-[#CDF8C9] hover:-translate-y-1 inter-medium flex justify-center items-center text-center rounded-[12px] border-2 border-[#CDF8C9] text-[16px] md:text-[20px]"
                          > 
                              {isSubmitting ? (
                                  <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-6 h-6"></div>
                              ) : (
                                  "SUBMIT"
                              )}
                        </button>
                      </div>
                  </form>
              </div>
        </div>
    </>
  )
}

const Contact = () => {
    return (
        <GoogleReCaptchaProvider reCaptchaKey="6LeBMMIqAAAAAL_OwMDNqGpTTO21ZpvlOFgWIdTH">
            <ContactForm />
        </GoogleReCaptchaProvider>
    );
};

export default Contact
