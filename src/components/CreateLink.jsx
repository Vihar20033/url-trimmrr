import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "./ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Error from "./error";
import * as yup from "yup";
import useFetch from "@/hooks/useFetch";
import { createUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { UrlState } from "@/context";
import QRCode from "react-qr-code"; 

export function CreateLink() {
  const { user } = UrlState();
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [qrValue, setQrValue] = useState("");
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink || "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup.string().url("Must be a valid URL").required("Long URL is required"),
    customUrl: yup.string(),
  });

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, {}); // Initial empty

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
  }, [error, data]);

  const createNewLink = async () => {
    setErrors({});
    try {
      await schema.validate(formValues, { abortEarly: false });

      // Generate short path
      const shortUrl = formValues.customUrl || Math.random().toString(36).substring(2, 8);
      const fullShortUrl = `https://trimrr.in/${shortUrl}`; // Customize to your domain
      setQrValue(fullShortUrl);

      await fnCreateUrl({
        original_url: formValues.longUrl,
        short_url: shortUrl,
        custom_url: formValues.customUrl,
        title: formValues.title,
        qr: fullShortUrl,
        user_id: user.id,
      });
    } catch (e) {
      const newErrors = {};
      if (e?.inner) {
        e.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
      } else {
        newErrors.general = e.message;
      }
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        </DialogHeader>

        {qrValue && (
          <div className="flex justify-center my-4">
            <QRCode value={qrValue} size={200} />
          </div>
        )}

        <Input
          id="title"
          placeholder="Short Link's Title"
          value={formValues.title}
          onChange={handleChange}
        />
        {errors.title && <Error message={errors.title} />}
        <Input
          id="longUrl"
          placeholder="Enter your Loooong URL"
          value={formValues.longUrl}
          onChange={handleChange}
        />
        {errors.longUrl && <Error message={errors.longUrl} />}
        <div className="flex items-center gap-2">
          <Card className="p-2">trimrr.in</Card> /
          <Input
            id="customUrl"
            placeholder="Custom Link (optional)"
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>
        {error && <Error message={error.message} />}
        {errors.general && <Error message={errors.general} />}

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="destructive"
            onClick={createNewLink}
            disabled={loading}
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLink;
