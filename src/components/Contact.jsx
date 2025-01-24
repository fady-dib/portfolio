import React, { useState } from "react";
import emailjs from "emailjs-com";

const Contact = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [isSubmitted, setIsSubmitted] = useState(false); 
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setError(false); 
        setIsSubmitting(true);

        emailjs
            .send(
                "service_btg0hmp", 
                "template_x8vxheh",
                formData,
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
        <div className='flex justify-center items-center px-4 pt-20'>
              <div className="w-full max-w-3xl bg-white md:p-10 p-5 rounded-lg shadow-lg border border-[#204958]">
                  {isSubmitted && (
                      <p className="text-green-500 text-center mb-4">Form submitted successfully!</p>
                  )}
                  {error && (
                      <p className="text-red-500 text-center mb-4">Error happened while submitting the form</p>
                  )}
                  <form onSubmit={handleSubmit}>
                      {/* Name Field */}
                    <div className="mb-6">
                          <label htmlFor="name" className="block text-[#666] inter-bold mb-2">
                              Name
                          </label>
                          <input
                              type="text"
                              id="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter Your Name"
                              className="w-full px-4 py-4 bg-gray-100 text-gray-700 border outline-none border-none rounded-md "
                              required
                          />
                      </div>

                      {/* Email Field */}
                    <div className="mb-6">
                          <label htmlFor="email" className="block text-[#666] inter-bold mb-2">
                              Email
                          </label>
                          <input
                              type="email"
                              id="email"
                              placeholder="Enter Your Email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full px-4 py-4 bg-gray-100 text-[#333] border rounded-md outline-none border-none"
                              required
                          />
                      </div>

                      {/* Message Field */}
                      <div className="mb-6">
                          <label htmlFor="message" className="block  text-[#666] inter-bold mb-2">
                              Message
                          </label>
                          <textarea
                              id="message"
                              placeholder="Enter Your Message"
                              rows="10"
                              value={formData.message}
                              onChange={handleChange}
                              className="w-full px-4 py-4 bg-gray-100 text-gray-700 border rounded-md outline-none border-none overflow-y-auto resize-none"
                              required
                          ></textarea>
                      </div>

                      {/* Submit Button */}
                      <div className="text-right">
                        <button
                            type="submit"
                            disabled={isSubmitting} 
                            style={{ marginLeft: "auto" }}
                              className="w-full md:w-[200px] py-4 bg-[#204958] text-white rounded-md focus:outline-none duration-700 hover:-translate-y-1 inter-bold flex justify-center items-center"
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

export default Contact
