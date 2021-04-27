import { FC, useState } from "react";
import { createUseStyles, useTheme } from "react-jss";
import MDSpinner from "react-md-spinner";
import { Icon } from "../../components/Icon";
import { IconButton } from "../../components/IconButton";
import { Input } from "../../components/Input";
import { List } from "../../components/List";
import { ListItem } from "../../components/ListItem";
import { Toolbar } from "../../components/Toolbar";
import { FetchRequest, useRequest } from "../../hooks/useRequest";
import { AppTheme } from "../../theme";
import { User } from "../../User";

const useStyles = createUseStyles((theme: AppTheme) => ({
  mainWrapper: {},
  emptySearchStateContainer: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    "& > h2": {
      ...theme.typography.subheading,
    },
    minHeight: 300,
    padding: [0, 12],
  },
  emptySearchIconWrapper: {
    width: 72,
    height: 72,
    boxSizing: "content-box",
    padding: ({ size }) => (size === "large" ? 36 : 24),
    backgroundColor: "rgba(103, 152, 248, 0.25)",
    display: "inline-block",
    borderRadius: "50%",
    "& > span": {
      color: theme.colors.primary.base.backgroundColor,
    },
  },
  top: {
    margin: [24, 24, 48, 24],
  },
  spinnerWrapper: {
    display: "grid",
    placeItems: "center",
    minHeight: 300,
  },
  heading: {
    ...theme.typography.preTitle,
    margin: [28, 28, 18, 28],
  },
  inner: {
    minHeight: 300,
  },
}));

interface APDProps {
  onSubmit: (invitees: User[]) => void;
  onClose: () => void;
  current: User[];
}

function queryUsers(q: string): FetchRequest {
  return {
    method: "GET",
    path: `users`,
    query: { q },
  };
}

let debounce = setTimeout(() => 0, 0);

export const AddParticipantsDialog: FC<APDProps> = ({
  onSubmit,
  current,
  onClose,
}) => {
  const [response, loading, update] = useRequest<{ users: User[] }>(queryUsers);
  const [query, setQuery] = useState("");

  const [invitees, setInvitees] = useState<User[]>([]);

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  function addInvitee(invitee: User) {
    setInvitees([invitee, ...invitees]);
    setQuery("");
  }

  function updateQuery(val: string) {
    setQuery(val);

    if (debounce) clearTimeout(debounce);

    if (val.length > 0) {
      debounce = setTimeout(() => update(val), 300);
    } 
  }

  function removeInvitee(invitee: User) {
    const idx = invitees.indexOf(invitee);
    setInvitees(invitees.slice().splice(idx, 1));
  }

  function inner() {
    if (!query || !response) {
      return (
        <div className={classes.emptySearchStateContainer}>
          <div className={classes.emptySearchIconWrapper}>
            <Icon name="search" size="giant" />
          </div>
          <h2 style={{ maxWidth: 400, lineHeight: 1.4, fontSize: 24 }}>
            Start typing an email address to invite more people to your event!
          </h2>
        </div>
      );
    } else if (loading) {
      return (
        <div className={classes.spinnerWrapper}>
          <MDSpinner />
        </div>
      );
    } else if (
      response.users.filter(
        (user) =>
          !current.find((c) => c.id === user.id) &&
          !invitees.find((i) => i.id === user.id)
      ).length < 1
    ) {
      return (
        <div className={classes.emptySearchStateContainer}>
          <div className={classes.emptySearchIconWrapper}>
            <Icon name="search" size="giant" />
          </div>
          <h2 style={{ maxWidth: 400, lineHeight: 1.4, fontSize: 24 }}>
            We couldn't find any users with that email.
          </h2>
        </div>
      );
    } else {
      return (
        <>
          <h3 className={classes.heading}>Results</h3>
          <List type="fill">
            {response.users
              .filter(
                (user) =>
                  !current.find((c) => c.id === user.id) &&
                  !invitees.find((i) => i.id === user.id)
              )
              .map((user) => (
                <ListItem
                  key={user.id}
                  button
                  onClick={() => addInvitee(user)}
                  subtitle={user.email}
                  end={<Icon name="add" />}
                >
                  {user.first_name} {user.last_name}
                </ListItem>
              ))}
          </List>
        </>
      );
    }
  }

  return (
    <div className={classes.mainWrapper}>
      <Toolbar
        title="Add Participants"
        start={<IconButton icon="close" onClick={onClose} />}
        end={
          <IconButton
            icon="check"
            color="accent"
            onClick={() => onSubmit(invitees)}
          />
        }
      />
      <div className={classes.top}>
        <Input
          label="search"
          type="search"
          placeholder="Invite with email address"
          value={query}
          onChange={updateQuery}
          forceFocus
        />
      </div>
      <div className={classes.inner}>{inner()}</div>
      {invitees.length > 0 && (
        <div>
          <h3 className={classes.heading}>New Participants</h3>
          <List type="fill">
            {invitees.map((invitee) => (
              <ListItem
                key={invitee.id}
                button
                onClick={() => removeInvitee(invitee)}
                end={<Icon name="delete" />}
                subtitle={invitee.email}
              >
                {invitee.first_name} {invitee.last_name}
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};
