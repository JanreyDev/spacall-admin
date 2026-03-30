"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ADMIN_TOKEN_STORAGE_KEY,
  ServiceCategory,
  ServiceItem,
  createServiceCategory,
  createService,
  deleteService,
  fetchServiceCategories,
  fetchServices,
  uploadServiceImage,
  updateService,
} from "@/lib/api";

interface ServiceFormState {
  category_id: string;
  name: string;
  short_description: string;
  description: string;
  duration_minutes: string;
  base_price: string;
  vip_price: string;
  sort_order: string;
  image_url: string;
  is_active: boolean;
}

const emptyForm: ServiceFormState = {
  category_id: "",
  name: "",
  short_description: "",
  description: "",
  duration_minutes: "60",
  base_price: "0",
  vip_price: "",
  sort_order: "0",
  image_url: "",
  is_active: true,
};

function formatMoney(value: string | number | null | undefined): string {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return "0.00";
  return num.toFixed(2);
}

export default function ServicesPage() {
  const [token, setToken] = useState<string>("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ServiceFormState>(emptyForm);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const activeServices = useMemo(
    () => services.filter((service) => service.is_active).length,
    [services],
  );

  useEffect(() => {
    const savedToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? "";
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    void loadCategories(token);
    void loadServices(token, search, categoryFilter);
    // This initializes data when auth token becomes available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function loadCategories(authToken: string) {
    try {
      const response = await fetchServiceCategories(authToken);
      setCategories(response.categories);
      if (!form.category_id && response.categories.length > 0) {
        setForm((prev) => ({
          ...prev,
          category_id: String(response.categories[0].id),
        }));
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch categories.");
    }
  }

  async function handleCreateCategory() {
    if (!token) {
      setErrorMessage("Missing admin token. Please sign in again.");
      return;
    }

    const name = newCategoryName.trim();
    if (!name) {
      setErrorMessage("Category name is required.");
      return;
    }

    try {
      setCreatingCategory(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      const response = await createServiceCategory(token, {
        name,
        description: newCategoryDescription.trim() || undefined,
      });
      await loadCategories(token);
      setForm((prev) => ({
        ...prev,
        category_id: String(response.category.id),
      }));
      setNewCategoryName("");
      setNewCategoryDescription("");
      setSuccessMessage(`Category "${response.category.name}" created.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create category.");
    } finally {
      setCreatingCategory(false);
    }
  }

  async function loadServices(authToken: string, searchValue: string, categoryValue: string) {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetchServices(authToken, {
        search: searchValue.trim() || undefined,
        category_id: categoryValue !== "all" ? Number(categoryValue) : null,
      });
      setServices(response.services);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch services.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingServiceId(null);
    setForm((prev) => ({
      ...emptyForm,
      category_id: categories[0] ? String(categories[0].id) : prev.category_id,
    }));
  }

  function fillFormForEdit(service: ServiceItem) {
    setEditingServiceId(service.id);
    setForm({
      category_id: String(service.category_id ?? ""),
      name: service.name ?? "",
      short_description: service.short_description ?? "",
      description: service.description ?? "",
      duration_minutes: String(service.duration_minutes ?? 60),
      base_price: String(service.base_price ?? 0),
      vip_price:
        service.vip_price === null || service.vip_price === undefined
          ? ""
          : String(service.vip_price),
      sort_order: String(service.sort_order ?? 0),
      image_url: service.image_url ?? "",
      is_active: Boolean(service.is_active),
    });
  }

  async function handleSave() {
    if (!token) {
      setErrorMessage("Missing admin token. Please sign in again.");
      return;
    }
    if (!form.category_id) {
      setErrorMessage("Category is required.");
      return;
    }
    if (!form.name.trim()) {
      setErrorMessage("Service name is required.");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const payload = {
        category_id: Number(form.category_id),
        name: form.name.trim(),
        short_description: form.short_description.trim(),
        description: form.description.trim(),
        duration_minutes: Number(form.duration_minutes),
        base_price: Number(form.base_price),
        vip_price: form.vip_price.trim() ? Number(form.vip_price) : null,
        is_active: form.is_active,
        sort_order: Number(form.sort_order || 0),
        image_url: form.image_url.trim(),
      };

      if (editingServiceId) {
        await updateService(token, editingServiceId, payload);
        setSuccessMessage("Service updated successfully.");
      } else {
        await createService(token, payload);
        setSuccessMessage("Service created successfully.");
      }

      await loadServices(token, search, categoryFilter);
      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to save service.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    const confirmed = window.confirm("Delete this service?");
    if (!confirmed) return;

    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      await deleteService(token, id);
      setSuccessMessage("Service deleted successfully.");
      await loadServices(token, search, categoryFilter);
      if (editingServiceId === id) {
        resetForm();
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete service.");
    }
  }

  async function handleImageFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!token) {
      setErrorMessage("Missing admin token. Please sign in again.");
      return;
    }

    try {
      setUploadingImage(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      const response = await uploadServiceImage(token, file);
      setForm((prev) => ({ ...prev, image_url: response.url }));
      setSuccessMessage("Image uploaded successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  }

  if (!token) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Admin session not found. Please sign in at <strong>/login</strong> first.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Services</p>
            <p className="text-2xl font-bold">{services.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Services</p>
            <p className="text-2xl font-bold">{activeServices}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Categories</p>
            <p className="text-2xl font-bold">{categories.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingServiceId ? "Edit Service" : "Create Service"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}

          <div className="rounded-md border p-4">
            <p className="text-sm font-medium">Add Category</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <Input
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                placeholder="Category name (e.g. Massage Services)"
              />
              <Input
                value={newCategoryDescription}
                onChange={(event) => setNewCategoryDescription(event.target.value)}
                placeholder="Description (optional)"
              />
              <Button onClick={handleCreateCategory} disabled={creatingCategory}>
                {creatingCategory ? "Adding..." : "Add Category"}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category_id}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, category_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Swedish Massage"
              />
            </div>

            <div className="space-y-2">
              <Label>Short Description</Label>
              <Input
                value={form.short_description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    short_description: event.target.value,
                  }))
                }
                placeholder="Quick summary shown in cards"
              />
            </div>

            <div className="space-y-2">
              <Label>Service Image</Label>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                onChange={handleImageFileChange}
                disabled={uploadingImage}
              />
              <p className="text-xs text-muted-foreground">
                {uploadingImage ? "Uploading image..." : "PNG, JPG, GIF, WEBP up to 2MB."}
              </p>
              {form.image_url ? (
                <p className="text-xs text-muted-foreground break-all">
                  Uploaded URL: {form.image_url}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                min={1}
                value={form.duration_minutes}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    duration_minutes: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Base Price</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.base_price}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, base_price: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>VIP Price</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.vip_price}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, vip_price: event.target.value }))
                }
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input
                type="number"
                min={0}
                value={form.sort_order}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, sort_order: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={form.is_active}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, is_active: checked }))
              }
            />
            <Label>Active</Label>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingServiceId ? "Update Service" : "Create Service"}
            </Button>
            {editingServiceId ? (
              <Button variant="outline" onClick={resetForm}>
                Cancel Edit
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Input
              placeholder="Search by service name or description"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="md:max-w-md"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Filter category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => loadServices(token, search, categoryFilter)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Apply Filters"}
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>VIP Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.category?.name ?? "Uncategorized"}</TableCell>
                  <TableCell>{service.duration_minutes} min</TableCell>
                  <TableCell>PHP {formatMoney(service.base_price)}</TableCell>
                  <TableCell>PHP {formatMoney(service.vip_price ?? service.base_price)}</TableCell>
                  <TableCell>{service.is_active ? "Active" : "Inactive"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => fillFormForEdit(service)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No services found.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
