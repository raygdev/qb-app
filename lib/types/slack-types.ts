export interface UserListResponse {
    ok: boolean,
    members: User[]
  }
  
export interface User {
      id: string,
      team_id: string,
      name: string,
      deleted: boolean,
      color: string,
      real_name: string,
      tz: string,
      tz_label: string,
      tz_offset: number
      profile: UserProfile
  }
  
export interface UserProfile {
      avatar_hash: string,
      status_text: string,
      status_emoji: string
      real_name: string,
      display_name: string,
      real_name_normalized: string,
      display_name_normalized: string,
      team: string,
      email?: string
      [key: `image_${number}`]: string
  }

  export interface Channel {
    id: string,
    name: string,
    is_channel: boolean,
    is_group: boolean,
    is_im: boolean,
    created: number,
    creator: string,
    is_archived: boolean,
    is_general: boolean,
    unlinked: number,
    name_normalized: string,
    is_shared: boolean,
    is_ext_shared: boolean,
    is_org_shared: boolean,
    is_pending_ext_shared: boolean,
    is_member: boolean,
    is_private: boolean,
    is_mpim: boolean,
    udpated: number,
    topic: {
        value: string,
        creator: string,
        last_set: number
    }
    purpose: {
        value: string,
        creator: string,
        last_set: number
    }
    previous_names: string[]
    num_members: number
  }

  export interface ChannelListResponse {
    ok: boolean,
    channels: Channel[],
    response_metadata: {
        next_cursor: string
    }
  }