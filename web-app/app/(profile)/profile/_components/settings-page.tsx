"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteAccount,
  updateActiveStatus,
  updatePassword,
} from "@/app/(profile)/_actions";
import { useUser } from "@/contexts/UserContext";

const passwordFormInitial = { error: null as string | null, success: false };

const deleteAccountInitial = { error: null as string | null };

function DeleteAccountDialogForm() {
  const [state, formAction, pending] = useActionState(
    deleteAccount,
    deleteAccountInitial,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="delete-account-password">Password</Label>
        <Input
          id="delete-account-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={pending}
          placeholder="Enter your password to confirm"
        />
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          type="submit"
          variant="destructive"
          disabled={pending}
          className="w-full sm:w-auto"
        >
          {pending ? "Deleting…" : "Delete my account"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function SettingsPage() {
  const { profile } = useUser();
  const router = useRouter();
  const [activeError, setActiveError] = useState<string | null>(null);
  const [optimisticActive, setOptimisticActive] = useState<boolean | null>(
    null,
  );
  const [activePending, startActiveTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteFormKey, setDeleteFormKey] = useState(0);
  const [passwordState, passwordFormAction, passwordPending] = useActionState(
    updatePassword,
    passwordFormInitial,
  );
  const passwordFormRef = useRef<HTMLFormElement>(null);

  const displayActive = optimisticActive ?? profile?.is_active ?? false;

  useEffect(() => {
    setOptimisticActive(null);
  }, [profile?.is_active]);

  useEffect(() => {
    if (passwordState.success) {
      passwordFormRef.current?.reset();
    }
  }, [passwordState.success]);

  function handleActiveChange(checked: boolean) {
    setActiveError(null);
    setOptimisticActive(checked);
    startActiveTransition(async () => {
      const result = await updateActiveStatus(checked);
      if (result.error) {
        setOptimisticActive(null);
        setActiveError(result.error);
        return;
      }
      setOptimisticActive(null);
      router.refresh();
    });
  }

  return (
    <div className="h-full w-full overflow-auto bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">

        {/* Page title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-sm text-gray-500">
            Manage your account and preferences
          </p>
        </div>

        {/* Active Status */}
        <Card className="border p-6 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Profile Status
              </h2>
            </div>
            <div className="flex flex-col gap-2 rounded-md border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Profile Visibility
                  </p>
                  <p className="text-sm text-gray-500">
                    When off, you won&apos;t appear for other students to find. 
                  </p>
                </div>
                <Checkbox
                  checked={displayActive}
                  disabled={!profile || activePending}
                  onCheckedChange={(v) => {
                    if (v === "indeterminate" || !profile) return;
                    handleActiveChange(v);
                  }}
                  aria-label="Active in discovery"
                />
              </div>
              {activeError ? (
                <p className="text-sm text-destructive" role="alert">
                  {activeError}
                </p>
              ) : null}
            </div>
          </div>
        </Card>

        {/* Password */}
        <Card className="border p-6 shadow-sm">
          <div className="space-y-6">

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Password
              </h2>
              <p className="text-sm text-gray-500">
                Change your account password
              </p>
            </div>

            <form
              ref={passwordFormRef}
              action={passwordFormAction}
              className="space-y-4"
            >
              {passwordState.error ? (
                <p className="text-sm text-destructive" role="alert">
                  {passwordState.error}
                </p>
              ) : null}
              {passwordState.success ? (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Your password has been updated.
                </p>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={passwordPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={passwordPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={passwordPending}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={passwordPending}>
                  {passwordPending ? "Updating…" : "Update password"}
                </Button>
              </div>
            </form>

          </div>
        </Card>

        {/* Delete account */}
        <Card className="border border-destructive/30 p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Delete Account
              </h2>
              <p className="text-sm text-gray-500">
                Permanently delete your account and associated data. This cannot
                be undone.
              </p>
            </div>
            <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setDeleteFormKey((k) => k + 1);
                setDeleteDialogOpen(true);
              }}
            >
              Delete account
            </Button>
            </div>
          </div>
        </Card>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent showCloseButton className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete your account?</DialogTitle>
              <DialogDescription>
                Your profile, discovery visibility, chats, and saved housing will
                be removed. You will need to sign up again to use the app.
              </DialogDescription>
            </DialogHeader>
            <DeleteAccountDialogForm key={deleteFormKey} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}